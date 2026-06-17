import router from '@/router'

export const commonJS = {

    toPascalCase: (str) => {
        return str.charAt(0).toUpperCase() + str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).slice(1);
    }
}

