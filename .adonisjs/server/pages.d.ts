import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/characters/_components/dialog/add-character-dialog': ExtractProps<(typeof import('../../inertia/pages/admin/characters/_components/dialog/add-character-dialog.tsx'))['default']>
    'admin/characters/_components/dialog/delete-character-dialog': ExtractProps<(typeof import('../../inertia/pages/admin/characters/_components/dialog/delete-character-dialog.tsx'))['default']>
    'admin/characters/_components/dialog/edit-character-dialog': ExtractProps<(typeof import('../../inertia/pages/admin/characters/_components/dialog/edit-character-dialog.tsx'))['default']>
    'admin/characters/_components/field/character-field': ExtractProps<(typeof import('../../inertia/pages/admin/characters/_components/field/character-field.tsx'))['default']>
    'admin/characters/index': ExtractProps<(typeof import('../../inertia/pages/admin/characters/index.tsx'))['default']>
    'admin/dashboard/index': ExtractProps<(typeof import('../../inertia/pages/admin/dashboard/index.tsx'))['default']>
    'auth/_components/field/avatar-field': ExtractProps<(typeof import('../../inertia/pages/auth/_components/field/avatar-field.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'device/index': ExtractProps<(typeof import('../../inertia/pages/device/index.tsx'))['default']>
    'dress': ExtractProps<(typeof import('../../inertia/pages/dress.tsx'))['default']>
    'dress/_components/character-selector': ExtractProps<(typeof import('../../inertia/pages/dress/_components/character-selector.tsx'))['default']>
    'drink': ExtractProps<(typeof import('../../inertia/pages/drink.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'family/index': ExtractProps<(typeof import('../../inertia/pages/family/index.tsx'))['default']>
    'family/invite': ExtractProps<(typeof import('../../inertia/pages/family/invite.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'setting': ExtractProps<(typeof import('../../inertia/pages/setting.tsx'))['default']>
    'setting/_components/form/birthdate-form': ExtractProps<(typeof import('../../inertia/pages/setting/_components/form/birthdate-form.tsx'))['default']>
    'setting/account': ExtractProps<(typeof import('../../inertia/pages/setting/account.tsx'))['default']>
    'setting/birthdate': ExtractProps<(typeof import('../../inertia/pages/setting/birthdate.tsx'))['default']>
    'setting/days': ExtractProps<(typeof import('../../inertia/pages/setting/days.tsx'))['default']>
    'setting/weight': ExtractProps<(typeof import('../../inertia/pages/setting/weight.tsx'))['default']>
    'setting/work-type': ExtractProps<(typeof import('../../inertia/pages/setting/work-type.tsx'))['default']>
  }
}
