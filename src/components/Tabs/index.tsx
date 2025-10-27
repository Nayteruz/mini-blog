import type { FC } from "react";
import type { ITabItem } from "@/types";
import styles from "./Tabs.module.css";

interface ITabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  list: ITabItem[];
}

export const Tabs: FC<ITabsProps> = ({ activeTab, setActiveTab, list }) => {


  return (
    <div className={styles.Tabs}>
      <div className={styles.header}>
        {list.map((item) => (
          <button
            key={item.key} className={`${styles.button} ${activeTab === item.key ? styles.active : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {list.find((item) => item.key === activeTab)?.content}
      </div>
    </div>
  );
}