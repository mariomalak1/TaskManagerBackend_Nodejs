export const paginate = async (request, Model, whereClues = null, defualtPage = 1, defualtPageSize = 10) => {
    let {page, limit} = request.query;
    let offset;

    // number of records
    const numOfRecords = await Model.count();
    // get maximum number of pages
    const maxPage = Math.ceil(numOfRecords / limit) || 0;


    // check if page, limit is found
    if(!page){
        offset = (defualtPage - 1) * defualtPageSize;
    }
    if(!limit){
        limit = defualtPageSize;
    }

    if(limit){
        limit = Number(limit);
        if(isNaN(limit)){
            limit = defualtPageSize;
        }
    }

    // check if page is found, check integrity 
    if(page){
        page = Number(page);

        if(!isNaN(page)){

            if(page < 1){
                page = 1;   
            }

            else {
                if(page > maxPage){
                    page = maxPage;
                }
            }


            offset = (page - 1) * limit;
        }

        else{
            offset = (defualtPage - 1) * limit;
        }

    }

    const records = await Model.findAll(
    {
        where: whereClues || 1,
        offset,
        limit
    });

    return {data: records, page: ((offset / limit) + 1), limit: limit, numberOfRecords: numOfRecords, maxPage: maxPage};
}