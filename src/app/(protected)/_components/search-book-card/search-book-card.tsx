import BookCard from "#/components/block/book-card";

const SearchBookCard = () => {
  return (
    <BookCard
      type="search"
      title="ユーザー検索"
      subtitle="他のユーザーを探す"
      href="/users"
    />
  );
};

export default SearchBookCard;
