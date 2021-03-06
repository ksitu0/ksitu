import { useRouter } from 'next/router'
import projects from '../api/projects.json'
import { CgClose } from 'react-icons/cg';
import fs from 'fs';
import matter from 'gray-matter';

import markdownToHtml from '../../lib/markdownToHtml';

import Nav from '../../components/nav'
import { useState } from 'react';
import MDXEmbed from './MDXEmbed';
import { compile, evaluate, run, runSync } from '@mdx-js/mdx'
import dynamic from 'next/dynamic';

import * as runtime from 'react/jsx-runtime.js'
import { MDXProvider } from '@mdx-js/react/lib';

export default function Project(props) {
  const router = useRouter()
  const { id } = router.query

  const [selected, setSelected] = useState(-1);

  const {default: MDXContent} = runSync(props.tldr, runtime)
  console.log(MDXContent)

  // phone scroll bad
  return (
    <div className="text-base dark:text-white dark:bg-black font-light md:h-screen md:max-h-screen md:flex md:flex-col">
      <Nav />
      <div className={`block md:w-screen md:flex md:flex-row my-10 px-4 md:mx-auto md:justify-center md:grow ${selected >=0 ? "md:overflow-hidden" : "overflow-scroll"}`}>
        <div className={` ${selected >=0 ? "md:w-5/12 overflow-y-scroll overflow-x-hidden" : "md:w-3/4"} max-w-prose md:mr-6 md:pr-4`}>
          <div className="text-2xl md:text-3xl font-semibold">{props.info.title}</div>
          <div className="text-lg my-3">{props.info.summary}</div>
          
          <div className="text-xl font-semibold my-3">TLDR (Synopsis) </div>
          <div className="prose dark:prose-invert"><MDXContent /></div>
          
          <div className="text-xl font-semibold my-3">Writings</div>
          <div className="flex-col rounded my-3">
            <div className="h-px bg-neutral-300 dark:bg-neutral-600"></div>
            {props.info.content && props.writings.map((i, idx) => (<>
              <div key={i.title} className={`${idx == selected ? "border-yellow-400 " : "border-transparent "} border-l-4 text-lg px-2 sm:my-0 py-1.5 sm:text-base sm:px-3 sm:py-2 hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-20 ${selected == idx ? 'bg-black/20 dark:bg-white/30' : ''} `}
                onClick={() => setSelected(idx)}
              >
                {i.title}
              </div>
              <div className="h-px bg-neutral-300 dark:bg-neutral-600"></div>
            </>
            ))}
          </div>
        </div>
        
        { props.writings.length > 0 ?
        <div className={`absolute md:static md:overflow-hidden md:h-full md:max-h-full transition-all top-0 right-0 ${selected >= 0 ? "w-screen p-4 md:max-w-prose md:w-1/2" : "w-0 p-0"} flex flex-col min-h-screen md:min-h-0 sm:rounded-lg bg-neutral-100 dark:bg-neutral-800`}>
          <div className={`self-end ${selected >= 0 ? "block" : "hidden"}`}>
            <button onClick={() => setSelected(-1)}><CgClose size={24} /> </button>
          </div>
          <div className="overflow-y-scroll overflow-x-hidden">
          <div className={`text-xl font-semibold ${selected >= 0 ? "block" : "hidden"} border-yellow-400 border-l-4 px-2 sm:my-0 py-1.5 sm:px-3 sm:py-2 `}>
            {selected >= 0 ? props.writings[selected].title : ''}
          </div>
          <div className={`${selected >= 0 ? "block" : "hidden"} prose dark:prose-invert my-3 pb-10 text-base leading-6 text-slate-600 dark:text-slate-400`} dangerouslySetInnerHTML={{ __html: props.writings[selected >= 0 ? selected : 0].htmlContent }}>
          </div>
          </div>
        </div> : ''}
      </div>

    </div>
  )
}


export async function getStaticProps(context) {
  const info = projects.projectCards.filter((i) => i.id == context.params.id)[0];
  if (info.content) {
    let tldr;
    if (!info.content.TLDR) {
      console.warn("wheres ur tldr")
      tldr="asf"
      // tldr = {status: 0, content: "<p>working on it!</p>\n"}
    } else {
      const compiled = await compile(fs.readFileSync("./pages/project" + info.content.TLDR), {outputFormat: 'function-body'})
      tldr=String(compiled)
      // const {default: MDXContent} = await evaluate(fs.readFileSync("./pages/project" + info.content.TLDR), {...runtime})
      // tldr = {status: 1, content: MDXContent}
    }

    let writings = await Promise.all(info.content.writings.map(async (i) => {
      const fileName = fs.readFileSync("./pages/project" + i.file, 'utf-8');
      const { data: frontmatter, content } = matter(fileName);
      let htmlContent = await markdownToHtml(content);
      return {
        title: i.title,
        frontmatter,
        htmlContent
      }
    })
    );

    return { props: { info, tldr, writings } }
  } else {
    return { props: { info } }
  }
}

export async function getStaticPaths() {
  const paths = projects.projectCards
    .filter((i) => i.url.substr(0, 9) === "/project/")
    .map((i) => {
      return { params: { id: i.url.substring(9) } }
    });
  return {
    paths,
    fallback: false
  }
}