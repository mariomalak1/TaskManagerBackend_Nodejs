import {paginate} from "../Utillis/paginationForModel.js";

export const getAll_Response = async (req, res, Model, needNumOfAllRecords = false, needMaxNumOfPage = false) => {
    const paginator = await paginate(req, Model);
    
    const response = responseObjWithPaginator(paginator, needNumOfAllRecords, needMaxNumOfPage);

    return res.status(200).json(response);
}

export const responseObjWithPaginator = (paginator, needNumOfAllRecords = false, needMaxNumOfPage = false) => {
    const response = {
        meta: {
            count: paginator.data.length,
            page: paginator.page,
            limit: paginator.limit,
        },
        data: paginator.data
    }

    if(needNumOfAllRecords){
        response.meta.numberOfRecords = numberOfRecords;
    }
    
    if(needMaxNumOfPage){
        response.meta.maxPage = paginator.maxPage;
    }

    return response;
}