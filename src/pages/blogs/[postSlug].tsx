import {
  NextPage,
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { ParsedUrlQuery } from "querystring";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths: GetStaticPaths = () => {
  // Reading Paths
  const dirPathToRead = path.join(process.cwd(), "src/posts");
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map((filename) => {
    const filePathToRead = path.join(process.cwd(), "src/posts/" + filename);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    //   return matter(fileContent).data;
    return { params: { postSlug: matter(fileContent).data.slug } };
  });

  console.log(paths);

  /**
   * fallback options
   * - false ==> This will return 404 pages for unknown slug
   * - blocking ==> This will first see the slug and will try to get data from static pange and if there is page it will first hang the browser and try to generate new page
   * - true ==> This will return the fake page for some time and once the data is ready it will server them page props
   */

  return {
    // paths: [{ params: { postSlug: "clever-lazy-loading-for-javascript" } }],
    paths,
    fallback: "blocking", // fallback for backwards
  };
};

interface IStaticProps extends ParsedUrlQuery {
  postSlug: string;
}

type Post = {
  post: {
    title: string;
    content: MDXRemoteSerializeResult;
  };
};

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  console.log(context);
  const { params } = context;
  const { postSlug } = params as IStaticProps;
  try {
    const filePathToRead = path.join(
      process.cwd(),
      "src/posts/" + postSlug + ".md"
    );
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    // const {content,data} = matter(fileContent);
    const source: any = await serialize(fileContent, {
      parseFrontmatter: true,
    });
    console.log(source);

    return {
      props: {
        post: {
          content: source,
          title: source.frontmatter.title,
        },
      },
    };
  } catch (error) {
    return { 
      notFound : true,
    }
  }
};

const SinglePage: NextPage<Props> = ({ post }) => {
  const router = useRouter();
  console.log(router);

  // if (router.isFallback) {
  //   return <p>Loading.....</p>
  // }

  const { content, title } = post;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-bold text-2xl py-5">{title}</h1>
      <div className="prose pb-20">
        <MDXRemote {...content} />
      </div>
    </div>
  );
};

export default SinglePage;
