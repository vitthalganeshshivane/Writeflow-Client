import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import toast from "react-hot-toast";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
      toast.success("Tag updated 💫");
      e.target.setAttribute("contentEditable", false);
    }
  };

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  const handleTagDelete = () => {
    const newTags = [...tags];
    newTags.splice(tagIndex, 1); // removes just the tag at tagIndex
    setBlog({ ...blog, tags: newTags });
    toast.error("tag removed 🗑️");
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
      <p
        className="outline-none"
        onKeyDown={handleTagEdit}
        onClick={addEditable}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
