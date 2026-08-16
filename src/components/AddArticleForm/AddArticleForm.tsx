'use client';

import css from './AddArticleForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createArticle } from '@/lib/api/clientApi';
import { createArticleSchema } from '@/lib/validation/createArticleSchema';
import type { CreateArticleRequest } from '@/types/article';
import { ArticleImagePicker } from '../ArticleImagePicker/ArticleImagePicker';
import { useArticleDraftStore } from '@/lib/store/articleDraftStore';

type FormValues = {
  title: string;
  article: string;
  img: File | null;
};

export default function AddArticleForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } =
  useArticleDraftStore();

  const createMutation = useMutation({
    mutationFn: createArticle,
  });

  const initialValues: FormValues = {
  title: draft.title,
  article: draft.article,
  img: null,
};

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    try {
      const payload: CreateArticleRequest = {
        title: values.title,
        article: values.article,
        img: values.img as File,
      };

      const createdArticle =
        await createMutation.mutateAsync(payload);

      toast.success('Article created successfully');

      clearDraft();

      router.push(`/articles/${createdArticle._id}`);
    } catch (error) {
      toast.error('Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={createArticleSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        handleChange,
      }) => (
        <Form className={css.form}>
          <div className={css.content}>
            <div className={css.imageBlock}>
              <ArticleImagePicker
                file={values.img}
                onChange={(file) => setFieldValue('img', file)}
              />
              <ErrorMessage
                name="img"
                component="p"
                className={css.error}
              />
            </div>

            <div className={css.leftSide}>
              <div className={css.field}>
                <label htmlFor="title" className={css.label}>
                  Title
                </label>

                <Field
                   id="title"
                   name="title"
                   as="textarea"
                   placeholder="Enter the title"
                   className={css.title}
                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                   handleChange(e);

                   setDraft({
                     title: e.target.value,
                     article: values.article,
                  });
                }}
                 />

                <ErrorMessage
                  name="title"
                  component="p"
                  className={css.error}
                />
              </div>

              <div className={css.field}>
                <Field
                  as="textarea"
                  id="article"
                  name="article"
                  rows={12}
                  placeholder="Enter a text"
                  className={css.textarea}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handleChange(e);

                  setDraft({
                  title: values.title,
                  article: e.target.value,
                  });
                }}
                />

                <ErrorMessage
                  name="article"
                  component="p"
                  className={css.error}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={
              isSubmitting ||
              createMutation.isPending
            }
          >
            {createMutation.isPending ? 'Publishing...' : 'Publish Article'}
          </button>
        </Form>
      )}
    </Formik>
  );
}