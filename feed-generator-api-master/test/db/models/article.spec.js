process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const mongoose = require('mongoose');

//connect to the files we are testing
const db = require('../../../db/index');
const ArticleModel = require('../../../db/models/article-schema');

describe('Article Model/Schema Test suite', () => {
    const article = {
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
        }

    )


    it.only('ArticleSchema has a module', () => {
        const Article = ArticleModel.create(article);
        expect(ArticleModel).not.be.be.undefined;
    });


    it.only('gets an article', async () => {
        let _article = new ArticleModel(article);
        await _article.save();

        const foundOne = await ArticleModel.findOne({
            'title': 'Tennis Championship 2020'
        });

        expect(foundOne.title).to.equal(article.title);
        expect(foundOne.description).to.equal(article.description);
        expect(foundOne.content).to.equal(article.content);
        expect(foundOne.author).to.eql(article.author);
        expect(foundOne.isFeatured).to.equal(false);

    })


    it.only('saves an article', async () => {
        let _article = new ArticleModel(article);
        await _article.save();

        expect(_article.title).to.equal(article.title);
        expect(_article.description).to.equal(article.description);
        expect(_article.content).to.equal(article.content);
        expect(_article.author).to.equal(article.author);
        expect(_article.isFeatured).to.equal(false);

    })
})