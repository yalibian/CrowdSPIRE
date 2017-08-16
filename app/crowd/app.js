import Koa from 'koa'
import path from 'path'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import mongo from 'koa-mongo'

const app = new Koa();

const staticPath = './static';


console.log(bodyParser);


app.use(mongo());

app.use(bodyParser());

app.use(koaStatic(
    path.join(__dirname, staticPath)
));


// response
app.use(async (ctx) => {
    console.log(ctx.url);
    if (ctx.url === '/submit' && ctx.method === 'POST') {
        let postData = ctx.request.body;
        console.log(postData);
        // store postData into db
        const result = await ctx.mongo.db('crowd').collection('connection').insert(postData);

        // console.log(postData)
        ctx.body = "Thanks for you help!"
    }
});

app.listen(80, () => console.log('server started 80'));

export default app
