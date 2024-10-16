import { Response, Request } from "express"
import { ImagesType } from "../../types/types"

export const editProductCrontroller = (req: Request, res: Response) => {
    const { OldImagesToDelete } = req.body;


    const js = JSON.parse(OldImagesToDelete) as ImagesType[];
    let links: string[] = [];

    js.forEach((link) => {
        links.push(link.url);
    })

    console.log(links);


    res.send("ok");
    return;
}