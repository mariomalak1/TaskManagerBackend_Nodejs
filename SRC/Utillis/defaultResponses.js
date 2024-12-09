import {paginate} from "../Utillis/paginationForModel.js";

export const getAll_Response = async (req, res, Model, needNumOfRecords = false, maxNumOfPage = false) => {
    const paginator = await paginate(req, Model);
    
    const response = {
        meta: {
            count: paginator.data.length,
            page: paginator.page,
            limit: paginator.limit,
        },
        data: paginator.data
    }

    if(needNumOfRecords){
        response.meta.numberOfRecords = numberOfRecords;
    }
    
    if(maxNumOfPage){
        response.meta.maxPage = paginator.maxPage;
    }

    return res.status(200).json(response);
}