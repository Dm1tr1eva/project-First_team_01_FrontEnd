'use client';

import { useRouter } from 'next/navigation';

import Modal from '@/components/Modal/Modal';

import { logout } from '@/lib/api/clientApi';

import { useAuthStore } from '@/lib/store/authStore';

export default function LogoutUserModalClient() {
  const router = useRouter();

  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const handleLogoutUser = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();

      router.back();

      router.push('/sign-in');
    }
  };

  return (
    <Modal onClose={() => router.back()}>
      <div>
        <h3>Are you sure?</h3>

        <p>We will miss you!</p>

        <div>
          <button onClick={handleLogoutUser}>Log out</button>

          <button onClick={() => router.back()}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
