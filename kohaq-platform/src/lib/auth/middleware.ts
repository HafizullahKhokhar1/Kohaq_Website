export const protectedPrefixes = ["/dashboard"];

export function isProtectedPath(pathname: string) {
	return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
