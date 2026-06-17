<script>
  import {commonJS} from '@/script/common.js'

  const defaultSubPages = [
    {path: '', name: '', subTitle: ''},
    {path: 'write', name: 'Write', subTitle: ' 작성'},
    {path: 'update/:id', name: 'Update', subTitle: ' 수정'},
    {path: ':id', name: 'Detail', subTitle: ' 상세'},
  ]

  const defaultChildrenList = (path, title, subTitle) => {
    return defaultSubPages.map((defaultChildren) => {
      return {
        path: defaultChildren.path,
        meta: {
          title: title,
          subTitle: subTitle + defaultChildren.subTitle,
        },
        component: `${commonJS.toPascalCase(path + defaultChildren.name)}`
      }
    })
  }

  const mainMenus = [
    {
      path: '', // URL path
      type: '', // SIDE OR NULL
      title: 'HOME',
      meta: {
        title: 'HOME',
        subTitle: '개발자 개인 블로그',
      },
      component: 'HomePage'
    },
    {
      path: 'login',
      title: 'LOGIN',
      meta: {
        title: 'LOGIN',
        subTitle: '로그인'
      }
      , component: 'Login'
    },
    {
      path: 'profile',
      type: 'side',
      title: 'profile',
      meta: {
        title: 'profile'
      }
      , component: 'Profile'
    },
    {
      path: 'free-board',
      type: 'side',
      title: '자유게시판',
      component: 'RouterView',
      children: defaultChildrenList('free-board', '자유게시판', '자유게시판')
    },
    {
      path: 'tip-board',
      type: 'side',
      title: '팁 게시판',
      component: 'RouterView',
      children: defaultChildrenList('tip-board', '팁 게시판', '팁 게시판')
    },
    {
      path: 'error-log',
      type: 'side',
      title: '오류로그',
      component: 'RouterView',
      children: defaultChildrenList('error-log', '오류 로그', '오류 로그')
    },
    {
      path: 'user-info',
      type: 'side',
      title: '회원 정보',
      level: 1,
      component: 'RouterView',
      children: defaultChildrenList('user-info', '회원 정보', '회원 정보')
    },
    {
      path: 'codes',
      type: 'side',
      title: '코드관리',
      level: 1,
      component: 'RouterView',
      children: defaultChildrenList('codes', '코드 관리', '코드 관리')
    }
  ]

  export const COMMON_MAIN_MENU = mainMenus;
</script>