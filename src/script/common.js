const regexMap = {
    userId : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,10}$/,
    userName : /^[가-힣A-Za-z0-9\s]{2,8}$/,
    password : /^.{4,15}$/
}

export const commonJS = {

    toPascalCase: (str) => {
        return str.charAt(0).toUpperCase() + str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).slice(1);
    },

    strRegex : (type, str) => {
        return regexMap[type].test(str);
    }
}

