import { SimplePokemon, SimpleMove, TypeChart } from '../types'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'
const cache: Record<string, any> = {}

function toSimpleMove(moveData: any): SimpleMove | null {
  if (!moveData || !('power' in moveData) || moveData.power === null || moveData.power === 0) return null
  const damageClass = moveData.damage_class?.name as 'physical' | 'special' | 'status'
  if (damageClass === 'status') return null
  return {
    id: moveData.id,
    name: moveData.names?.find((n: any) => n.language.name === 'en')?.name || moveData.name,
    type: moveData.type?.name || 'normal',
    power: moveData.power,
    accuracy: moveData.accuracy,
    damageClass: damageClass || 'physical',
    effect: moveData.effect_entries?.find((e: any) => e.language?.name === 'en')?.short_effect || null,
  }
}

export async function fetchPokemonSimple(pokemonId: number): Promise<SimplePokemon | null> {
  if (cache[`pokemon_${pokemonId}`]) return cache[`pokemon_${pokemonId}`]
  try {
    const r = await fetch(`${POKEAPI_BASE}/pokemon/${pokemonId}`)
    if (!r.ok) return null
    const data = await r.json()
    const animatedSprite = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default
    const staticSprite = data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default
    const sprite = animatedSprite || staticSprite
    const types: string[] = data.types?.map((t: any) => t.type.name) || []
    const stats = {
      hp: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 40,
      atk: data.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 50,
      def: data.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 50,
      spAtk: data.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 50,
      spDef: data.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 50,
      speed: data.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 50,
    }

    // gather moves; filter those with power & damage class
    // OPTIMIZATION: Only fetch first 10 moves to reduce API calls
    const moveEntries = (data.moves || []).slice(0, 10)
    const candidates: Array<Promise<SimpleMove | null>> = []
    for (const m of moveEntries) {
      candidates.push(
        (async () => {
          if (cache[`move_${m.move.name}`]) return cache[`move_${m.move.name}`]
          const r = await fetch(m.move.url)
          const md = await r.json()
          const sm = toSimpleMove(md)
          cache[`move_${m.move.name}`] = sm
          return sm
        })()
      )
    }
    const movesRaw = await Promise.all(candidates)
    const moves = movesRaw.filter(Boolean) as SimpleMove[]
    // pick up to 4 moves (prefer higher power)
    moves.sort((a, b) => (b.power || 0) - (a.power || 0))
    const finalMoves = moves.slice(0, 4)

    // Fetch evolution data
    const evolutions: { name: string, condition?: string }[] = []
    try {
      const speciesRes = await fetch(`${POKEAPI_BASE}/pokemon-species/${pokemonId}`)
      if (speciesRes.ok) {
        const speciesData = await speciesRes.json()
        const evolutionChainUrl = speciesData.evolution_chain?.url
        if (evolutionChainUrl) {
          const evolutionChainRes = await fetch(evolutionChainUrl)
          if (evolutionChainRes.ok) {
            const evolutionChainData = await evolutionChainRes.json()

            const getEvolutions = (chainLink: any) => {
              if (chainLink.species.name === data.name) {
                for (const evolvesToLink of chainLink.evolves_to) {
                  let condition: string | undefined = undefined
                  if (evolvesToLink.evolution_details.length > 0) {
                    const detail = evolvesToLink.evolution_details[0]
                    if (detail.min_level) condition = `Level ${detail.min_level}`
                    else if (detail.item) condition = `Use ${detail.item.name.replace('-', ' ')}`
                    else if (detail.trigger?.name === 'trade') condition = 'Trade'
                  }
                  evolutions.push({ name: evolvesToLink.species.name, condition })
                }
              } else {
                for (const evolvesToLink of chainLink.evolves_to) {
                  getEvolutions(evolvesToLink)
                }
              }
            }
            getEvolutions(evolutionChainData.chain)
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch evolution data for ${data.name}`, e)
    }

    const result: SimplePokemon = {
      id: data.id,
      name: data.name,
      sprite,
      types,
      stats,
      moves: finalMoves,
      evolutions,
    }
    cache[`pokemon_${pokemonId}`] = result
    return result
  } catch (e) {
    console.warn('fetchPokemonSimple failed', e)
    return null
  }
}

export async function fetchRandomPokemonPool(count: number): Promise<SimplePokemon[]> {
  const max = 1010 // approximate; PokeAPI v2 IDs
  const ids = new Set<number>()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1)
  }
  const promises = Array.from(ids).map(id => fetchPokemonSimple(id))
  const results = await Promise.all(promises)
  return results.filter(Boolean) as SimplePokemon[]
}

export async function fetchPokemonByNameOrId(nameOrId: string | number) {
  if (cache[`pokemon_${nameOrId}`]) return cache[`pokemon_${nameOrId}`]
  try {
    const r = await fetch(`${POKEAPI_BASE}/pokemon/${nameOrId}`)
    if (!r.ok) return null
    const data = await r.json()
    const res = await fetchPokemonSimple(data.id)
    cache[`pokemon_${nameOrId}`] = res
    return res
  } catch (e) {
    return null
  }
}

export async function fetchTypeChart(): Promise<TypeChart> {
  if (cache['typechart']) return cache['typechart']
  try {
    const r = await fetch(`${POKEAPI_BASE}/type`)
    const data = await r.json()
    const types = data.results
    const map: TypeChart = {}
    const promises = types.map(async (t: any) => {
      const vr = await fetch(t.url)
      const vdata = await vr.json()
      map[vdata.name] = {
        double_from: vdata.damage_relations.double_damage_from.map((x: any) => x.name) || [],
        half_from: vdata.damage_relations.half_damage_from.map((x: any) => x.name) || [],
        zero_from: vdata.damage_relations.no_damage_from.map((x: any) => x.name) || [],
      }
    })
    await Promise.all(promises)
    cache['typechart'] = map
    return map
  } catch (e) {
    console.warn('fetchTypeChart failed', e)
    return {}
  }
}

export async function fetchPoolCached(count: number) {
  const key = `pool_${count}`
  if (cache[key]) return cache[key]
  const pool = await fetchRandomPokemonPool(count)
  cache[key] = pool
  return pool
}
