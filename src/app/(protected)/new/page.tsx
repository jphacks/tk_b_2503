import DiaryCreateForm from "./_components/diary-create-form";
import { getFollowingUsers } from "./_libs/get-following-users";

const DiaryCreatePage = async () => {
  const followingUsers = await getFollowingUsers();

  return (
    <section>
      <DiaryCreateForm followingUsers={followingUsers} />
    </section>
  );
};

export default DiaryCreatePage;
