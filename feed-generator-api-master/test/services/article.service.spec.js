process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const mongoose=require('mongoose');

//connect to the files we are testing
const db = require('../../db/index');
const UserModel=require('../../db/models/user-schema');
const ArticleModel=require('../../db/models/article-schema');
const ArticleService = require('../../services/article.service')(ArticleModel);

describe('ArticleService Test suite', () => {

    before((done) => {
        db.connect()
            .then(() => {
                ArticleModel.deleteMany({});
                done()
            })
            .catch((error) => done(error));
    })

    beforeEach((done) => {
        ArticleModel.deleteMany({});
        done();
    })

    after((done) => {
        db.close()
            .then(() => {
                ArticleModel.deleteMany({});
                done();
            })
            .catch((error) => done(error));
    })

    afterEach((done) => {
        ArticleModel.deleteMany({});
        done()
    })

    it('ArticleService is a module', () => {
        expect(ArticleService).not.to.be.undefined;
    })

    describe('ArticleService.addArticle()', () => {

        beforeEach((done) => {
            ArticleModel.deleteMany({});
            done();
        })


        afterEach((done) => {
            ArticleModel.deleteMany({});
            done()
        });

        it.only('Ok Add Article Successfully', async () => {
            let mockArticle = {
                "title": "Tennis Championship 2020",
                "description": "Hottest Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":false
            }

            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Article added successfully');
        });

        it.only('Fail to add a new article without title', async () => {
            let mockArticle = {
                "description": "Hottest Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":false
            }
            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal('Article validation failed: title: article title is required');


        });

        it.only('Fail to add a new article without description', async () => {
            let mockArticle = {
                "title": "Tennis Championship 2020",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":false
            }
            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal('Article validation failed: description: article description is required');


        });

        it.only('Fail to add a new article without content', async () => {
            let mockArticle = {
                "title": "Tennis Championship 2020",
                "description": "Hottest Championship",
                "author": mongoose.Types.ObjectId(),
                "isFeatured":false
            }
            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal('Article validation failed: content: article content is required');


        });

        it.only('Fail to add a new article without author', async () => {
            let mockArticle = {
                "title": "Tennis Championship 2020",
                "description": "Hottest Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "isFeatured":false
            }
            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal('Article validation failed: author: article author is required');


        });

        it.only('Fail to add a new article without isFeatured', async () => {
            let mockArticle = {
                "title": "Tennis Championship 2020",
                "description": "Hottest Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
            }
            let result = await ArticleService.addArticle(mockArticle);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal('Article validation failed: isFeatured: article isFeatured is required');


        });

        it.only('Fail to add a new article with empty args', async () => {

            let result = await ArticleService.addArticle();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Article');
            expect(result.payload.message).to.equal(`Article validation failed: author: article author is required, isFeatured: article isFeatured is required, content: article content is required, description: article description is required, title: article title is required`);


        })
    })

    describe('ArticleService.getAllArticle()', () => {
        it.only('Ok get All Articles Successfully', async () => {
            await UserModel.deleteMany({});
            let user=await UserModel.create({
                fullusername:"Ferid HELALI",
                email:"helaliferid@gmail.com",
                password:'toto',
                adress:"Mahdia",
                city:"Mahdia"
            })

            await ArticleModel.deleteMany();
            let articles = [
                new ArticleModel({
                    "title": "Tennis Championship 2020",
                    "description": "Hottest Championship",
                    "content": `<h1>Tennis 2020</h1>
                                <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                                magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                                enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                    "author":user._id,
                    "isFeatured":false
                }), new ArticleModel( {
                    "title": "Tennis Championship 2023",
                    "description": "Erlangen Championship",
                    "content": `<h1>Tennis 2023</h1>
                                <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                                magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                                enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                    "author": user._id,
                    "isFeatured":false
                })
            ];
            await ArticleModel.insertMany(articles);

            let result = await ArticleService.getAllArticles();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.payload).to.be.an("array");
            expect(result.payload.length).to.equal(2);
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Get All Articles');
        });

        it.only('Fail to get all Articles', async () => {
            db.close();
            let result = await ArticleService.getAllArticles();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to get all Articles');
        });


    });

    describe('ArticleService.getArticleById(id)', () => {
        before(async () => {
            await db.connect();
            await ArticleModel.deleteMany({});
        })
        beforeEach(async () => {
            await ArticleModel.deleteMany({});
        })
        afterEach(async () => {
            await ArticleModel.deleteMany({});
        });

        it.only('Ok get an Article by id Successfully', async () => {
            let article = new ArticleModel( {
                "title": "Tennis Championship 2020",
                "description": "Hottest Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                            magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":false
            });

            await article.save();
            let result = await ArticleService.getArticleById(article._id);

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('success to get the Article');
            expect(result.payload).to.contain.property('title');
            expect(result.payload).to.contain.property('description');
            expect(result.payload).to.contain.property('content');
            expect(result.payload).to.contain.property('author');
            expect(result.payload).to.contain.property('isFeatured');
            expect(result.payload.title).to.be.equal(article.title);
            expect(result.payload.description).to.be.equal(article.description);
            expect(result.payload.content).to.be.equal(article.content);
            expect(result.payload.isFeatured).to.be.equal(article.isFeatured);
            

        });

        it.only('Fail to get an Article by unvalid id ', async () => {

            let result = await ArticleService.getArticleById(1);

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to get the Article');

        });

        it.only('Fail to  get an Article with out a given id', async () => {
            let result = await ArticleService.getArticleById();

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Cant't get an Article without id`);

        });

    });


    describe('ArticleService.updateArticle(id,article)', () => {
        let oldArticle =  {
            "title": "Tennis Championship 2020",
            "description": "Hottest Championship",
            "content": `<h1>Tennis 2020</h1>
                        <p>Est mollit ex cillum elit proident ad dolore consectetur. Labore mollit do pariatur 
                        magna. Sint nulla mollit veniam sunt laborum minim excepteur laborum. In incididunt labore 
                        enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
            "author": mongoose.Types.ObjectId(),
            "isFeatured":false
        }

        before((done) => {
            db.connect()
                .then(() => {
                    ArticleModel.deleteMany({});
                    done()
                })
                .catch((error) => done(error));
        })

        beforeEach(async () => {
            await ArticleModel.deleteMany();
        })

        afterEach(async () => {
            await ArticleModel.deleteMany();
        })

        it.only('Ok Should update article with a given new values fullname,adress,city and isLicenced', async () => {

            let old = await ArticleModel.create(oldArticle);
            let newValues =  {
                "title": "Kasparski Championship",
                "description": "Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident  consectetur. Labore mollit do pariatur 
                            magna. Sint nulla  veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":true
            }

            result = await ArticleService.updateArticle(old._id, newValues);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Article updated successfully');
            expect(result.payload).to.contain.property('title');
            expect(result.payload).to.contain.property('description');
            expect(result.payload).to.contain.property('content');
            expect(result.payload).to.contain.property('author');
            expect(result.payload).to.contain.property('isFeatured');
            expect(result.payload.title).to.be.equal(newValues.title);
            expect(result.payload.description).to.be.equal(newValues.description);
            expect(result.payload.content).to.be.equal(newValues.content);
            expect(result.payload.isFeatured).to.be.equal(newValues.isFeatured);

            
        })

        it.only('Fail Should fail to update Article with a wrong _id', async () => {

            let old = await ArticleModel.create(oldArticle);
            let newValues ={
                "title": "Kasparski Championship",
                "description": "Championship",
                "content": `<h1>Tennis 2020</h1>
                            <p>Est mollit ex cillum elit proident  consectetur. Labore mollit do pariatur 
                            magna. Sint nulla  veniam sunt laborum minim excepteur laborum. In incididunt labore 
                            enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
                "author": mongoose.Types.ObjectId(),
                "isFeatured":true
            }

            result = await ArticleService.updateArticle(1, newValues);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Update Article is failed');

        })

        it.only('Fail Should fail to update Article without values ie empty body', async () => {

            let old = await ArticleModel.create(oldArticle);

            result = await ArticleService.updateArticle(old._id, {});
            expect(result).not.to.be.undefined;

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to update Article');

        })
    })

    describe('ArticleService.removeArticle(id)', () => {
        let article = {
            "title": "Kasparski Championship",
            "description": "Championship",
            "content": `<h1>Tennis 2020</h1>
                        <p>Est mollit ex cillum elit proident  consectetur. Labore mollit do pariatur 
                        magna. Sint nulla  veniam sunt laborum minim excepteur laborum. In incididunt labore 
                        enim cillum ex aliqua est consequat pariatur aute quis.</p>`,
            "author": mongoose.Types.ObjectId(),
            "isFeatured":true
        }

        beforeEach(async () => {
            await ArticleModel.deleteMany();
        })

        afterEach(async () => {
            await ArticleModel.deleteMany();
        })



        it.only('Ok, Delete an article with a given id', async () => {

            let before = await ArticleModel.create(article);
            let id = before._id;

            result = await ArticleService.removeArticle(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`Article removed successfully`);
            expect(result.payload).not.to.be.undefined;
        })


        it.only('Fail, To delete an article with a wrong id', async () => {

            let before = await ArticleModel.create(article);
            let id = "3256452";

            result = await ArticleService.removeArticle(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Removing Article is failed`);
            expect(result.payload).not.to.be.undefined;
        })

        it.only('Fail, To delete an article without an id', async () => {

            let before = await ArticleModel.create(article);


            result = await ArticleService.removeArticle();

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Unable to remove Article`);
            expect(result.payload).not.to.be.undefined;
        })
    })

})