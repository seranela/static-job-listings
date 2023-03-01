# Frontend Mentor - Job listings with filtering solution

This is a solution to the [Job listings with filtering challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/job-listings-with-filtering-ivstIPCt). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- Filter job listings based on the categories

### Links

- Solution URL: [https://www.frontendmentor.io/solutions/job-listings-with-filtering-8_sZsAoa6M](https://www.frontendmentor.io/solutions/job-listings-with-filtering-8_sZsAoa6M)
- Live Site URL: [https://seranela.github.io/static-job-listings/](https://seranela.github.io/static-job-listings/)

## My process

### Built with

- HTML5
- CSS
- Flexbox
- CSS Grid
- JavaScript
- Mobile-first workflow

### What I learned

The filtering of jobs based on the individual categories was probably the most challenging aspect. At first, I didn't read the entire README about the specifics of the filtering. My rough implementation of it was pretty close to what was described in the README. Since entire specifics weren't given, I guessed as good as I could to how it should be done. Filtering is done per category, but all categories are taken into consideration when deciding whether to show or hide a job listing. The language and tool categories have more than one (array) selection that can be enabled, so that is also considered for.

I created a custom function similar to `Array.includes()` that would be like an `Array.includesAll()`. It checks to see if all items of a source array exist in a target array. This is what I used while checking filter tags within the language and tool categories. I probably could've prototyped it in my JavaScript, but didn't.

## Author

- Frontend Mentor - [@seranela](https://www.frontendmentor.io/profile/seranela)