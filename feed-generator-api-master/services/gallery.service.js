
const addPicture = Gallery => async (picture) => {
 
    const newPicture = new Gallery(picture);
    try {  
        const save = await newPicture.save();  
        if (save) {
            return ({
                status: "success",
                message: "Picture added successfully",
                payload: save
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to add new Picture",
            payload: error
        })
    }

}

const getAllPictures = Gallery => async () => {
    try {
        let pictures = await Gallery.find({}).populate('owner');
        if (pictures) {
            return ({
                status: "success",
                message: "Get All Pictures",
                payload: pictures
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to get all Pictures",
            payload: error
        })
    }
}

const getPictureById = Gallery => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Cant't get a picture without id`,
            payload: null
        })
    } else {
        try {
            let picture = await Gallery.findById(id).populate('owner');
            if (picture) {
                return ({
                    status: "success",
                    message: "success to get a picture",
                    payload: picture
                })
            }
        } catch (error) {
            return ({
                status: "error",
                message: "Unable to get the picture",
                payload: error
            })
        }
    }
}


const getPicturesByOwnerId = Gallery => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Unable get pictures for this user`,
            payload: null
        })
    } else {
        try {
            let pictures = await Gallery.find({owner:id}).populate('owner');
            if (pictures) {
                return ({
                    status: "success",
                    message: "success to get all user pictures",
                    payload: pictures
                })
            }
        } catch (error) {
            return ({
                status: "error",
                message: "Unable to get user pictures",
                payload: error
            })
        }
    }
}




const removeGallery = Gallery => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: "Unable to remove picture",
            payload: null
        })
    } else {
        try {
            let picture = await Gallery.deleteOne({
                _id: id
            });
            if (picture) {
                return ({
                    status: "success",
                    message: `Picture removed successfully`,
                    payload: picture
                });
            }


        } catch (error) {
            return ({
                status: "error",
                message: "Removing Picture is failed",
                payload: error
            })
        }
    }
}



module.exports = (Gallery) => {
    return {
        addPicture: addPicture(Gallery),
        getAllPictures: getAllPictures(Gallery),
        getPicturesByOwnerId:getPicturesByOwnerId(Gallery),
        getPictureById: getPictureById(Gallery),
        removeGallery: removeGallery(Gallery),
    }
}