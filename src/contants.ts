import type { IMenuItem } from "./types";

export const BASE_HOST = "/mini-blog/";

export const PAGES: Record<string, IMenuItem> = {
	MAIN: {
		title: "Главная",
		path: "/",
		isAuth: false,
	},
	CATEGORIES: {
		title: "Категории",
		path: "/categories",
		isAuth: true,
	},
	CATEGORIES_LEFT: {
		title: "Посты по категориям",
		path: "/category/:categoryId",
		pathOrigin: "/category",
		isAuth: false,
	},
	POST_LIST: {
		title: "Все заметки",
		path: "/posts",
		isAuth: false,
	},
	POST_CREATE: {
		title: "Добавить заметку",
		path: "/post/create",
		isAuth: true,
	},
	POST_EDIT: {
		title: "Редактировать заметку",
		path: "/post/edit/:postId",
		pathOrigin: "/post/edit",
		isAuth: true,
	},
	SIGN_IN: {
		title: "Авторизация",
		path: "/sign-in",
		isAuth: false,
	},
	SIGN_OUT: {
		title: "Выйти",
		path: "*",
		isAuth: true,
	},
};

export const DEFAULT_TOP_MENU = [
	{
		label: PAGES.MAIN.title,
		path: PAGES.MAIN.path,
	},
	{
		label: PAGES.CATEGORIES_LEFT.title,
		path: PAGES.CATEGORIES_LEFT.pathOrigin || "",
	},
	{
		label: PAGES.POST_LIST.title,
		path: PAGES.POST_LIST.path,
	},
	{
		label: PAGES.SIGN_IN.title,
		path: PAGES.SIGN_IN.path,
	},
];

export const USER_TOP_MENU = [
	{
		label: PAGES.MAIN.title,
		path: PAGES.MAIN.path,
	},
	{
		label: PAGES.CATEGORIES_LEFT.title,
		path: PAGES.CATEGORIES_LEFT.pathOrigin || "",
	},
	{
		label: PAGES.CATEGORIES.title,
		path: PAGES.CATEGORIES.path,
	},
	{
		label: PAGES.POST_LIST.title,
		path: PAGES.POST_LIST.path,
	},
	{
		label: PAGES.POST_CREATE.title,
		path: PAGES.POST_CREATE.path,
	},
];
