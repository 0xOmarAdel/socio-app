import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import useCommentActions from "../../hooks/useCommentActions";
import UserImage from "../User/UserImage";
import TextareaForm from "../../ui/TextareaForm";

type Props = {
  reFetchFunction?: () => void;
  editCommentFunction?: (commentId: string, text: string) => void;
  postId?: string;
  commentId?: string;
  commentText?: string;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentForm: React.FC<Props> = ({
  reFetchFunction,
  editCommentFunction,
  postId,
  commentId,
  commentText,
  setIsEditing,
}) => {
  const currentUser = useSelector(selectUser);
  const { submitComment, editComment } = useCommentActions();

  const [text, setText] = useState(commentText ?? "");
  const [showFormIcon, setShowFormIcon] = useState(false);

  useEffect(() => {
    if (!!commentId && !!commentText) {
      setShowFormIcon(true);
    }
  }, [commentId, commentText]);

  const submitHandler = async () => {
    if (text) {
      await submitComment(postId!, text);
      reFetchFunction!();
      setText("");
    }
  };

  const editHandler = async () => {
    if (text) {
      await editComment(commentId!, text);
      editCommentFunction!(commentId!, text);
      setIsEditing!(false);
    }
  };

  return (
    <div className="flex flex-row gap-0 sm:gap-3">
      <UserImage
        className="hidden sm:block min-w-[2.5rem] w-10 min-h-[2.5rem] h-10"
        src={currentUser!.userPicture}
        username={currentUser!.username}
      />
      <TextareaForm
        text={text}
        setText={setText}
        submitFunction={commentId ? editHandler : submitHandler}
        showFormIcon={showFormIcon}
      />
    </div>
  );
};

export default CommentForm;
