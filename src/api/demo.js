import { request } from '@/service';

export default async function test() {
  return request.get('/api/demo');
}
