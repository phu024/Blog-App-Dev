import fs from 'fs';
import path from "path";
import matter from "gray-matter";
import { PostApiResponse } from '@/utils/typese';

export const readPostsInfo = () : PostApiResponse =>{
    const dirPathToRead = path.join(process.cwd(), 'src/posts');
    const dirs = fs.readdirSync(dirPathToRead);
    const data =  dirs.map(filename => {
        const filePathToRead = path.join(process.cwd(), 'src/posts/'+ filename);
        const fileContent =fs.readFileSync(filePathToRead, { encoding: 'utf-8' });
        return matter(fileContent).data;
    });

    return data as PostApiResponse;
    
}