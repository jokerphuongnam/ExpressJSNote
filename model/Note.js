class Note {

    constructor(nid, title, isFavorite, detail, tags, tasks, images,sounds, noticeTimes) {
        this.nid = nid
        this.title = title
        this.isFavorite = isFavorite
        this.detail = detail
        this.tags = tags
        this.tasks = tasks
        this.images = images
        this.sounds = sounds
        this.noticeTimes = noticeTimes
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