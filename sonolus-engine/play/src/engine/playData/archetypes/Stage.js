import { skin } from '../skin.js'

export class Stage extends Archetype {
    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return entityInfos.get(0).state === EntityState.Despawned
    }

    updateParallel() {
        const layout = new Rect({
            l: -screen.aspectRatio,
            r: screen.aspectRatio,
            t: 1 - 0.02,
            b: 1 + 0.02,
        })

        skin.sprites.judgeLine.draw(layout, [0], touches.count ? 1 : 0.5)
    }
}
