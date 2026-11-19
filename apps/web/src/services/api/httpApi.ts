import { meToDomain } from "@/adapters/auth.adapter";
import { formsToDomain as formToDomain } from "@/adapters/forms.adapter";
import { AuthApi } from "@/api/AuthApi";
import { FormsApi } from "@/api/FormsApi";
import { FormsListItem, Me, Theme} from "@/types/domain";
import {CatalogApi} from "@/api/CatalogApi";
import {themeToDomain} from "@/adapters/catalog.adapter";

const authApi = new AuthApi();
const formsApi = new FormsApi();
const catalogApi = new CatalogApi();

export const httpApi = {
  async getMe(): Promise<Me> {
    const me = await authApi.getMe();
    return meToDomain(me);
  },

  async logout(): Promise<void> {
    await authApi.logout();
  },

  async getFormsList(): Promise<FormsListItem[]> {
    const forms = await formsApi.getFormsList();
    return forms.map(formToDomain);
  },

  async getThemes(): Promise<Theme[]> {
    const themes = await catalogApi.getThemes();
    return themes.map(themeToDomain);
  }
}
