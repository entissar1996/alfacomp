const addArticle = Article => async (article) => {
    const newArticle = new Article(article)
    try {
        const save = await newArticle.save();
        if (save) {
            return ({
                status: "success",
                message: "Article added successfully",
                payload: save
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to add new Article",
            payload: error
        })
    }

}

const getAllArticles = Article => async () => {
    try {
        let articles = await Article.find({})
            .populate({
                path: 'author customer',
                populate: {
                    path: 'customer'
                }
            })
            .populate('cover');

        if (articles) {
            return ({
                status: "success",
                message: "Get All Articles",
                payload: articles
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to get all Articles",
            payload: error
        })
    }
}

const getArticleById = Article => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Cant't get an Article without id`,
            payload: null
        })
    } else {
        try {
            let article = await Article.findById(id).populate('author').populate('cover');
            if (article) {
                return ({
                    status: "success",
                    message: "success to get the Article",
                    payload: article
                })
            }
        } catch (error) {
            return ({
                status: "error",
                message: "Unable to get the Article",
                payload: error
            })
        }
    }
}

const getArticlesByAuthor = Article => async (authorId) => {
    if (authorId === undefined) {
        return ({
            status: "error",
            message: `Unable get articles without author ref`,
            payload: null
        })
    } else {
        try {
            let articles = await Article.find({
                author: authorId
            }).populate('author').populate('cover');
            if (articles) {
                return ({
                    status: "success",
                    message: "success to get the user articles",
                    payload: articles
                })
            }
        } catch (error) {
            return ({
                status: "error",
                message: "Unable to get the articles",
                payload: error
            })
        }
    }
}

const updateArticle = Article => async (id, article) => {
    if (id === undefined || article === undefined || JSON.stringify(article) === "{}") {
        return ({
            status: "error",
            message: "Unable to update Article",
            payload: null
        })
    }
    try {
        let updatedArticle = await Article.findByIdAndUpdate(id, article);
        if (updatedArticle) {
            return ({
                status: "success",
                message: "Article updated successfully",
                payload: await Article.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Update Article is failed",
            payload: error
        })
    }
}

const removeArticle = Article => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: "Unable to remove Article",
            payload: null
        })
    } else {
        try {
            let article = await Article.deleteOne({
                _id: id
            });
            if (article) {
                return ({
                    status: "success",
                    message: `Article removed successfully`,
                    payload: article
                });
            }


        } catch (error) {
            return ({
                status: "error",
                message: "Removing Article is failed",
                payload: error
            })
        }
    }
}

const setFaturedArticle = Article => async (userId, articleId) => {
    if (userId === undefined || articleId === undefined) {
        return ({
            status: "error",
            message: "Unable to set Article as Featured ...",
            payload: null
        })
    }
    try {
        let articles = await Article.updateMany({
            author: userId
        }, {
            $set: {
                'isFeatured': false
            }
        });

        let featuredArticle = await Article.findByIdAndUpdate(articleId, {
            isFeatured: true
        });

        let updatedArticles = await Article.find({
            author: userId
        }).populate('author').populate('cover');


        if (updatedArticles) {
            return ({
                status: "success",
                message: "set Featured Article updated successfully",
                payload: updatedArticles
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to set Article as Featured",
            payload: error
        })
    }
}


const getFearuredArticle = Article => async (userId)=>{
    if (userId === undefined) {
        return ({
            status: "error",
            message: "Unable to get Featured Article",
            payload: null
        })
    }
    try {
        let article = await Article.find({author:userId,isFeatured:true}).populate('author').populate('cover');
        if (article) {
            return ({
                status: "success",
                message: "Get featured Article for this user successfully",
                payload: article
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to get Featured Article for this user",
            payload: error
        })
    }
}


module.exports = (Article) => {
    return {
        addArticle: addArticle(Article),
        getAllArticles: getAllArticles(Article),
        getArticleById: getArticleById(Article),
        getArticlesByAuthor: getArticlesByAuthor(Article),
        updateArticle: updateArticle(Article),
        removeArticle: removeArticle(Article),
        setFaturedArticle: setFaturedArticle(Article),
        getFearuredArticle:getFearuredArticle(Article)
    }
}