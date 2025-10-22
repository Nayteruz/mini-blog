export interface IPost {
	id: string;
	title: string;
	text: string;
	author: {
		name: string;
		id: string;
	};
	categoryId: string;
	categoryPath: string[];
	createdAt: any;
}

export type ICreatePostData = Omit<IPost, "id">;

export interface ICategory {
	id: string;
	name: string;
	parentId: string | null;
	path: string[];
	depth: number;
	createdAt: any; // Firebase timestamp
	createdBy: string;
}

export interface ICreateCategoryData {
	name: string;
	parentId: string | null;
	path: string[];
	depth: number;
	createdAt: any;
	createdBy: string;
}
