import model from 'src/app/support/model'
import { resource } from 'src/app/infra/services/http/resource'
import { reference, api as organization } from 'src/domains/admin/organization/model'

/**
 * @type {string}
 */
export const icon = 'supervisor_account'

/**
 * @type {string}
 */
export const label = 'Usuários'

/**
 * @type {string}
 */
export const title = 'Cadastro de Usuários'

/**
 * @type {string}
 */
export const tooltip = 'Defina quais usuários terão acesso a sua aplicação e gerencie-os'

/**
 * @type {string}
 */
export const api = '/admin/user'

/**
 * @type {string}
 */
export const id = 'id'

/**
 * @type {string}
 */
export const path = '/dashboard/admin/user'

/**
 * @type {string}
 */
export const namespace = 'admin.user'

/**
 * @type {Resource}
 */
export const service = resource(api)

/**
 * @type {Object}
 */
export const meta = model.meta(icon, label, title, tooltip)

/**
 * @type {Object}
 */
export const pivot = model.pivot(organization, reference, 'organization_id')

/**
 * @type {Function}
 */
export const menu = model.menu(icon, label, path, false, tooltip, namespace)

// configure buttons
const actions = ($this, actions) => {
  const map = button => {
    if (['edit', 'destroy'].includes(button.id)) {
      button.access = (record, $component, $user) => {
        return record && String(record['id']) !== '2'
      }
    }
    return button
  }
  return actions.map(map)
}

/**
 * @param {string} scope
 * @param {Route} route
 * @returns {Object}
 */
export const grid = (scope, route) => {
  return {
    id: id,
    service: service,
    path: path,
    position: 'left',
    rule: 'like',
    pagination: true,
    search: true,
    schemas: fields('index'),
    filters: filters(scope, route),
    actions: actions,
    debug: true
  }
}

/**
 * @param {string} scope
 * @param {Route} route
 * @returns {Object}
 */
export const form = (scope, route) => {
  return {
    id: id,
    service: service,
    path: path,
    scope: scope,
    schemas: fields(scope),
    actions: ($this, actions) => {
      return actions
    },
    debug: true
  }
}

/**
 * @param {string} scope
 * @param {Route} route
 * @returns {Array}
 */
export const fields = (scope, route = null) => {
  return model.filter(
    [
      model.field('id', 'Código').$pk().$render(),
      model.field('name', 'Nome').$text().$filter().$required().$form({width: 70}).$render(),
      model.field('profile', 'Perfil').$required().$out('index').$form({width: 30})
        .$select('list', [
          {label: 'Geral', value: 'general'},
          {label: 'Atendimento', value: 'support'},
          {label: 'Financeiro', value: 'financial'},
          {label: 'Contabilidade', value: 'accountant'}
        ]).$render(),
      model.field('email', 'E-mail').$text().$filter().$required().$form({width: 50}).$render(),
      model.field('password', 'Senha').$password().$required(scope === 'create')
        .$scopes(['create', 'edit']).$form({width: 50}).$render(),
      model.field('organizations', 'Organizações').$required().$out('index')
        .$form({width: 50, placeholder: '.: Selecione as Organizações :.'})
        .$pivot(pivot).$render()
    ],
    scope
  )
}

/**
 * @param {string} scope
 * @param {Route} route
 * @returns {Array}
 */
export const filters = (scope, route = null) => {
  return []
}
