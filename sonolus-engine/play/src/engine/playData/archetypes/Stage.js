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
            t: -0.92,
            b: -0.88,
        })

        skin.sprites.note.draw(layout, [0], 0)
    }
}
