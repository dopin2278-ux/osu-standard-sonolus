export class Stage extends Archetype {
    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return entityInfos.get(0).state === EntityState.Despawned
    }

    updateParallel() {
        // Temporary rendering probe: verify the standard note sprite and touch state
        // before wiring chart data and osu! hit windows into a dedicated HitCircle archetype.
        const layout = Rect.one.mul(0.2)

        skin.sprites.note.draw(layout, [1], touches.count ? 1 : 0.75)
    }
}
