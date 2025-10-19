import CreateForm from "./_components/create-form";

type Props = {
  params: Promise<{
    user_id: string;
    diary_id: string;
  }>;
};

const PostCreatePage = async ({ params }: Props) => {
  const { diary_id } = await params;

  return (
    <section>
      <CreateForm diaryId={diary_id} />
    </section>
  );
};

export default PostCreatePage;
