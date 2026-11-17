import { meToDomain } from "@/adapters/auth.adapter";
import { formsToDomain as formToDomain } from "@/adapters/forms.adapter";
import { AuthApi } from "@/api/AuthApi";
import { FormsApi } from "@/api/FormsApi";
import { FormsListItem, Me } from "@/types/domain";

const authApi = new AuthApi();
const formsApi = new FormsApi();

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
  }
}
