<script setup lang="ts">
import { reactive } from 'vue';
import { NButton } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchUpdatePassword, fetchUpdateProfile } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { MD5 } from '@sa/utils';

defineOptions({
  name: 'UserCenter'
});

const authStore = useAuthStore();
const { userInfo } = authStore;

const { loading: btnLoading, startLoading: startBtnLoading, endLoading: endBtnLoading } = useLoading();

const {
  formRef: profileFormRef,
  validate: profileValidate,
  restoreValidation: profileRestoreValidation
} = useNaiveForm();
const {
  formRef: passwordFormRef,
  validate: passwordValidate,
  restoreValidation: passwordRestoreValidation
} = useNaiveForm();
const { createRequiredRule, patternRules } = useFormRules();

type ProfileModel = Api.Auth.UserProfileModifyParams;
type PasswordModel = Api.Auth.UserPasswordModifyParams & { confirmPassword: string };

const profileModel: ProfileModel = reactive(createDefaultProfileModel());
const passwordModel: PasswordModel = reactive(createDefaultPasswordModel());

function createDefaultProfileModel(): ProfileModel {
  console.log('userInfo', userInfo);
  return {
    userName: userInfo.userName || '',
    mobilePhone: userInfo.mobilePhone || '',
    gender: userInfo.gender ?? 2
  };
}

function createDefaultPasswordModel(): PasswordModel {
  return {
    oldPassword: '',
    confirmPassword: '',
    newPassword: ''
  };
}

type ProfileRuleKey = Extract<keyof ProfileModel, 'userName' | 'mobilePhone' | 'gender'>;
type PasswordRuleKey = Extract<keyof PasswordModel, 'oldPassword' | 'newPassword' | 'confirmPassword'>;

const profileRules: Record<ProfileRuleKey, App.Global.FormRule> = {
  userName: createRequiredRule('昵称不能为空'),
  mobilePhone: { ...patternRules.phone, required: true },
  gender: createRequiredRule('性别不能为空')
};

const passwordRules: Record<PasswordRuleKey, App.Global.FormRule> = {
  oldPassword: createRequiredRule('旧密码不能为空'),
  confirmPassword: createRequiredRule('确认密码不能为空'),
  newPassword: createRequiredRule('新密码不能为空')
};

async function updateProfile() {
  await profileValidate();
  startBtnLoading();
  const { error } = await fetchUpdateProfile(profileModel);
  if (!error) {
    window.$message?.success('更新成功');
    // 更新本地用户信息
    if (userInfo) {
      Object.assign(userInfo, profileModel);
      profileRestoreValidation();
    }
  }
  endBtnLoading();
}

async function updatePassword() {
  await passwordValidate();
  if (passwordModel.newPassword !== passwordModel.confirmPassword) {
    window.$message?.error('两次输入的密码不一致');
    return;
  }
  startBtnLoading();
  const { oldPassword, newPassword } = passwordModel;
  const oldPasswordStr = MD5.encrypt(
    import.meta.env.VITE_REQUEST_SECRET + oldPassword + import.meta.env.VITE_REQUEST_SECRET
  );
  const newPasswordStr = MD5.encrypt(
    import.meta.env.VITE_REQUEST_SECRET + newPassword + import.meta.env.VITE_REQUEST_SECRET
  );
  const { error } = await fetchUpdatePassword({ oldPassword: oldPasswordStr, newPassword: newPasswordStr });
  if (!error) {
    window.$message?.success('密码修改成功');
    // 清空表单
    Object.assign(passwordModel, createDefaultPasswordModel());
    passwordRestoreValidation();
  }
  endBtnLoading();
}
</script>

<template>
  <div class="flex gap-16px">
    <!-- 个人信息卡片 -->
    <NCard title="个人信息" class="w-360px shadow-sm">
      <div class="flex-x-center flex-wrap gap-24px">
        <div class="flex-center flex-col gap-16px">
          <div class="text-18px font-medium">{{ userInfo.userName }}</div>
        </div>
        <NDescriptions :column="1" label-placement="left" label-width="120px">
          <NDescriptionsItem label="所属公司">
            <div class="text-14px">{{ userInfo.companyName }}</div>
          </NDescriptionsItem>
          <NDescriptionsItem label="手机号码">
            <div class="text-14px">{{ userInfo.mobilePhone }}</div>
          </NDescriptionsItem>
          <NDescriptionsItem label="创建日期">
            <div class="text-14px">{{ userInfo.createdTime }}</div>
          </NDescriptionsItem>
        </NDescriptions>
      </div>
    </NCard>

    <!-- 基本资料卡片 -->
    <NCard title="基本资料" class="shadow-sm">
      <NTabs type="line" animated class="h-full" s>
        <NTabPane name="userInfo" tab="基本资料">
          <NForm ref="profileFormRef" :model="profileModel" :rules="profileRules" label-placement="left"
            label-width="100px" class="mt-16px max-w-520px">
            <NFormItem label="昵称" path="userName">
              <NInput v-model:value="profileModel.userName" placeholder="请输入昵称" />
            </NFormItem>
            <NFormItem label="手机号" path="mobilePhone">
              <NInput v-model:value="profileModel.mobilePhone" placeholder="请输入手机号" />
            </NFormItem>
            <NFormItem label="性别" path="gender">
              <NRadioGroup v-model:value="profileModel.gender">
                <NRadio :value="0">女</NRadio>
                <NRadio :value="1">男</NRadio>
                <NRadio :value="2">其他</NRadio>
              </NRadioGroup>
            </NFormItem>
            <NFormItem class="flex items-center justify-end">
              <NButton class="ml-20px w-80px" type="primary" :loading="btnLoading" @click="updateProfile">
                <template #icon>
                  <SvgIcon icon="ic:outline-save" class="size-24px" />
                </template>
                保存
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>
        <NTabPane name="updatePwd" tab="修改密码">
          <NForm ref="passwordFormRef" :model="passwordModel" :rules="passwordRules" label-placement="left"
            label-width="100px" class="mt-16px max-w-520px">
            <NFormItem label="旧密码" path="oldPassword">
              <NInput v-model:value="passwordModel.oldPassword" type="password" placeholder="请输入旧密码"
                show-password-on="click" />
            </NFormItem>
            <NFormItem label="新密码" path="newPassword">
              <NInput v-model:value="passwordModel.newPassword" type="password" placeholder="请输入新密码"
                show-password-on="click" />
            </NFormItem>
            <NFormItem label="确认密码" path="confirmPassword">
              <NInput v-model:value="passwordModel.confirmPassword" type="password" placeholder="请再次输入新密码"
                show-password-on="click" />
            </NFormItem>
            <NFormItem class="flex items-center justify-end">
              <NButton class="ml-20px w-120px" type="primary" :loading="btnLoading" @click="updatePassword">
                <template #icon>
                  <SvgIcon icon="ic:outline-key" class="size-24px" />
                </template>
                修改密码
              </NButton>
            </NFormItem>
          </NForm>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.n-tabs-pane-wrapper),
:deep(.n-tab-pane) {
  height: 100% !important;
}
</style>
