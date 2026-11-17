import { z } from 'zod';

/** The Step that asks for a name — the only Step that can refuse Forward. */
export const USERNAME_STEP = 7;

/** Mirrors the input's maxLength so the two can never disagree. */
export const NAME_MAX_LENGTH = 32;

/** ASCII digits and punctuation: what a name is not made of. */
const NOT_A_LETTER = /[0-9!-/:-@[-`{-~]/;

/** Hyphens, apostrophes, stops and spaces are part of real names. */
const NAME_PUNCTUATION = /['’.\-\s]/g;

/**
 * A name is what we greet someone by, so the bar is "looks like a name", not
 * "looks like an identifier": at least two letters, no digits or symbols, and
 * any script at all — Arabic, Urdu, Latin, or any script with combining marks,
 * which is why this checks what a name must not contain rather than listing
 * the characters it may.
 */
export const userNameSchema = z.object({
  name: z.string().superRefine((value, ctx) => {
    const name = value.trim();
    const letters = name.replace(NAME_PUNCTUATION, '');

    if (name.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please tell us your name so we can greet you.',
      });
      return;
    }

    if (NOT_A_LETTER.test(letters)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Use letters, spaces, hyphens and apostrophes only.',
      });
      return;
    }

    if (letters.length < 2) {
      ctx.addIssue({
        code: 'custom',
        message: 'That name needs at least two letters.',
      });
      return;
    }

    if (name.length > NAME_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        message: `Keep it to ${NAME_MAX_LENGTH} characters or fewer.`,
      });
    }
  }),
});

export type UserNameForm = z.infer<typeof userNameSchema>;
