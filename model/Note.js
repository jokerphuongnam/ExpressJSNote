class Note {

    constructor(nid, title, isFavorite, detail, tags, tasks, images,sounds, noiticeTimes) {
        this.nid = nid
        this.title = title
        this.isFavorite = isFavorite
        this.detail = detail
        this.tags = tags
        this.tasks = tasks
        this.images = images
        this.sounds = sounds
        this.noiticeTimes = noiticeTimes
    }

    set appendImage(imageLink) {
        this.images.push(imageLink)
    }

    set appendSound(soundsLink) {
        this.sounds.push(soundsLink)
    }

    static makeNodForSave() {

    }
}

exports.Note = Note