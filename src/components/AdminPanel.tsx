import { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";
import { Icon } from "./icon";
import { useNavigate } from "react-router-dom";
import { defaultCategories } from "../model/task";

type AdminTab = "categories" | "settings" | "data";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("categories");
  const [categories, setCategories] = useState<string[]>(() => {
    const storedCategories = localStorage.getItem("categories");
    return storedCategories ? JSON.parse(storedCategories) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Save categories to local storage whenever they change
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToDelete));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
      </div>

      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tab} ${activeTab === "categories" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <Icon name="tag" />
            Categories
          </button>
          {/* <button
            className={`${styles.tab} ${activeTab === "settings" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Icon name="gear" />
            Settings
          </button>
          <button
            className={`${styles.tab} ${activeTab === "data" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("data")}
          >
            <Icon name="database" />
            Data
          </button> */}
        </div>

        <div className={styles.tabContent}>
          {activeTab === "categories" && (
            <>
              <div className={styles.categoriesPanel}>
                <div className={styles.sectionHeader}>
                  <h2>Manage Categories</h2>
                  <p>Add, edit, or remove task categories</p>
                </div>

                <div className={styles.addCategorySection}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Enter new category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={styles.categoryInput}
                    />
                    <button
                      onClick={handleAddCategory}
                      className={styles.addButton}
                      disabled={!newCategory.trim()}
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                <div className={styles.categoriesList}>
                  <h3>Current Categories</h3>
                  <div className={styles.categoryGrid}>
                    {categories.map((category) => (
                      <div key={category} className={styles.categoryItem}>
                        <span className={styles.categoryName}>{category}</span>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className={styles.deleteButton}
                          title={`Delete ${category}`}
                        >
                          <Icon name="trash" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.backButtonContainer}>
                <button
                  className={styles.backButton}
                  onClick={() => navigate("/")}
                  title="Done"
                >
                  Done
                </button>
              </div>
            </>
          )}
          {/* 
          {activeTab === "settings" && (
            <div className={styles.settingsPanel}>
              <div className={styles.sectionHeader}>
                <h2>Application Settings</h2>
                <p>Configure general application preferences</p>
              </div>
              <div className={styles.comingSoon}>
                <Icon name="gear" />
                <span>Settings coming soon...</span>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className={styles.dataPanel}>
              <div className={styles.sectionHeader}>
                <h2>Data Management</h2>
                <p>Import, export, and backup your data</p>
              </div>
              <div className={styles.comingSoon}>
                <Icon name="database" />
                <span>Data management coming soon...</span>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
