export class HitObject extends Archetype {
    import = this.defineImport({
        time: { name: 'time', type: Number },
        x: { name: 'x', type: Number },
        y: { name: 'y', type: Number },
        type: { name: 'type', type: Number },
        hitSound: { name: 'hitSound', type: Number },
    })

    targetTime = this.entityMemory(Number)
    spawnTime = this.entityMemory(Number)

    preprocess() {
        this.targetTime = this.import.time
        this.spawnTime = this.targetTime - 1.5
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    updateParallel() {
        if (this.despawn) return

        if (time.now > this.targetTime + 0.135) {
            this.despawn = true
            return
        }

        const x = Math.remap(
            0,
            512,
            -screen.aspectRatio,
            screen.aspectRatio,
            this.import.x,
        )

        const y = Math.remap(
            384,
            0,
            -1,
            1,
            this.import.y,
        )

        const layout = Rect.one
            .mul(0.08)
            .translate(x, y)

        skin.sprites.note.draw(layout, [1, -this.targetTime], 1)
    }

    touch() {
        if (time.now < this.targetTime - 0.135) return
        if (time.now > this.targetTime + 0.135) return

        for (const touch of touches) {
            if (!touch.started) continue

            this.despawn = true
            return
        }
    }
}
