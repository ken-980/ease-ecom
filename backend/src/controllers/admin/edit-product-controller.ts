import { Response, Request } from "express"
import { ImagesType } from "../../types/types"
import { imagePulbicIdExtractor } from "../../services/admin/public-id-extractor";
import { deletImageLinksFromCloud } from "../../services/admin/cloudinary/product-link-delete";

export const editProductCrontroller = async (req: Request, res: Response) => {
    const { OldImagesToDelete } = req.body;


    const js = JSON.parse(OldImagesToDelete) as ImagesType[];
    let links: string[] = [];

    js.forEach((link) => {
        links.push(link.url);
    })

    //if there images to be deleted
    if (links.length !== 0) {
        const imageIds = imagePulbicIdExtractor(links);

        const del = await deletImageLinksFromCloud(imageIds);
    }


    res.send("ok");
    return;
}