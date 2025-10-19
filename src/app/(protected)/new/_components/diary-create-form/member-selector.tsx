import type { FC } from "react";
import { useState, useMemo } from "react";

import styles from "./member-selector.module.css";

type User = {
  id: string;
  name: string;
  image: string | null;
};

type MemberSelectorProps = {
  users: User[];
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
};

export const MemberSelector: FC<MemberSelectorProps> = ({
  users,
  selectedUserIds,
  onSelectionChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    const query = searchQuery.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(query));
  }, [users, searchQuery]);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          メンバーを選択
          <span className={styles.count}>{selectedUserIds.length}人選択中</span>
        </label>
        <input
          type="text"
          placeholder="ユーザーを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className={styles.noUsers}>
          {users.length === 0
            ? "フォロー中のユーザーがいません"
            : "該当するユーザーが見つかりません"}
        </p>
      ) : (
        <div className={styles.userList}>
          {filteredUsers.map((user) => (
            <label key={user.id} className={styles.userItem}>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleToggleUser(user.id)}
                className={styles.checkbox}
              />
              <div className={styles.userInfo}>
                {user.image && (
                  <img
                    src={user.image}
                    alt=""
                    className={styles.userAvatar}
                    width={32}
                    height={32}
                  />
                )}
                <span className={styles.userName}>{user.name}</span>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
