import { ROLE } from '../role.js';

export function canViewPost(user, post) {
  return (user.role === ROLE.ADMIN || post.authorId === user.id);
}

export function canDeletePost(user, post) {
  return (post.authorId === user.id);
}