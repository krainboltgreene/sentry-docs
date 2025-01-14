import React, {FormEvent, useRef} from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

interface FeedbackFormProps {
  onClose: () => void;
  onSubmit: (data: {comment: string; email: string; name: string}) => void;
}

const retrieveStringValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
};

export function FeedbackForm({onClose, onSubmit}: FeedbackFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      name: retrieveStringValue(formData, 'name'),
      email: retrieveStringValue(formData, 'email'),
      comment: retrieveStringValue(formData, 'comment'),
    });
  };

  const user = window.Sentry?.getCurrentHub().getScope()?.getUser();

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Label htmlFor="sentry-feedback-name">
        Name
        <Input
          type="text"
          id="sentry-feedback-name"
          name="name"
          placeholder="Anonymous"
          defaultValue={user?.username}
        />
      </Label>
      <Label htmlFor="sentry-feedback-email">
        Email
        <Input
          type="text"
          id="sentry-feedback-email"
          name="email"
          placeholder="you@test.com"
          defaultValue={user?.email}
        />
      </Label>
      <Label htmlFor="sentry-feedback-comment">
        Description
        <TextArea
          rows={5}
          onKeyDown={event => {
            if (event.key === 'Enter' && event.ctrlKey) {
              formRef.current.requestSubmit();
            }
          }}
          id="sentry-feedback-comment"
          name="comment"
          placeholder="What's the bug? What did you expect?"
        />
      </Label>
      <ButtonGroup>
        <SubmitButton type="submit">Send Bug Report</SubmitButton>
        <CancelButton type="button" onClick={onClose}>
          Cancel
        </CancelButton>
      </ButtonGroup>
    </Form>
  );
}

const Form = styled.form`
  display: grid;
  overflow: auto;
  flex-direction: column;
  gap: 16px;
  padding: 0;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
`;

const inputStyles = css`
  box-sizing: border-box;
  border: 1.5px solid rgba(41, 35, 47, 0.13);
  border-radius: 6px;
  font-size: 14px;
  padding: 6px 12px;
  &:focus {
    border-color: rgba(108, 95, 199, 1);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 8px;
`;

const buttonStyles = css`
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
`;

const SubmitButton = styled.button`
  ${buttonStyles}
  background-color: rgba(108, 95, 199, 1);
  border-color: rgba(108, 95, 199, 1);
  color: #fff;
  &:hover {
    background-color: rgba(88, 74, 192, 1);
  }
`;

const CancelButton = styled.button`
  ${buttonStyles}
  background-color: #fff;
  color: #231c3d;
  font-weight: 500;
  &:hover {
    background-color: #eee;
  }
`;
