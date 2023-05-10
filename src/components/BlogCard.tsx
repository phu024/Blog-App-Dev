import Link from "next/link";
import { FC } from "react";
interface Props {
  title: string;
  description: string;
  slug: string;
}
const BlogCard: FC<Props> = ({ title, description, slug }): JSX.Element => {
  return (
    <div className="block">
      <Link href={"/blogs/" + slug}>
        <div className="bg-green-50 p-2 rounded cursor-pointer">
          <h1 className="text-gray-900 text-3xl font-semibold">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
