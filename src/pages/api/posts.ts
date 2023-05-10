import { NextApiHandler } from "next";
import fs from 'fs';
import path from "path";
import matter from "gray-matter";

// Methods
// Get => when you neet to just get or read the data.
// POST => when you want to send some fresh data.
// PATCH => when you want to update some parts of the data.
// PUT => when you want to replace the old data with new data.
// DELETE => when you want to remove removed.

const handler: NextApiHandler = (req, res) => {

    // How to read file and folder inside node.js

    const { method } = req
    switch (method) {
        case "GET":{

            const data = readPostsInfo()
            return res.json({ postInfo: data });
        } 
        default: return res.status(404).send('Not Found');
    }
}

const readPostsInfo = () =>{
    const dirPathToRead = path.join(process.cwd(), 'src/posts');
    const dirs = fs.readdirSync(dirPathToRead);
    const data =  dirs.map(filename => {
        const filePathToRead = path.join(process.cwd(), 'src/posts/'+ filename);
        const fileContent =fs.readFileSync(filePathToRead, { encoding: 'utf-8' });
        return matter(fileContent).data;
    });

    return data;
    
}

export default handler;