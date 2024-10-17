


export const imagePulbicIdExtractor = (links: string[]) => {

    const searchTerm = "product-images/";

    const ids = links.map((link) => {

        const index = link.indexOf(searchTerm);

        let str = "";
        for (let i = index; i < link.length; i++) {
            if (link[i] !== '.') {
                str += link[i]
            } else {
                break;
            }
        }

        return str;
    })
    return ids;
}  