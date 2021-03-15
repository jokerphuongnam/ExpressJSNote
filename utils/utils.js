exports.Utils = class Utils {
    static parseBoolean(data) {
        switch (typeof data) {
            case Boolean:
                return data
            case String:
                const dataLowerCase = data.toLowerCase()
                return dataLowerCase == 'true' ?
                    true : dataLowerCase == 'false' ?
                        false : dataLowerCase == 't' ?
                            true : dataLowerCase == 'f' ?
                                false : false
            default:
                return false
        }
    }

    static parseArray(data) {
        if (data == undefined || data == null) return []
        return JSON.parse(data)
    }

    static tasks(data) {
        if (data == undefined || data == null) return []
        data = JSON.parse(data)
        if (data.length == 0) return []
        if (data[0].isFinish != null || data[0].isFinish != undefined) {
            return data
        } else {
            for (var i = 0; i < data.length; i++) {
                data[i] = {
                    isFinish: false,
                    detail: data[i]
                }
            }
            return data
        }
    }

    static getTokenFromUser(users, token) {
        if (users.length == 0) return undefined
        var key
        var tokens
        var to
        for (key in users) {
            tokens = users[key].tokens
            to = tokens.find((e) => e == token)
            console.log(to)
            if (to) {
                return users[key]
            }
        }
        return undefined
    }
}