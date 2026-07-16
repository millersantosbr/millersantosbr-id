"use client";

import { useEffect, useState } from "react";

type GitHubProfile = {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  fork: boolean;
  archived: boolean;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
};

const GITHUB_USER = "millersantosbr";
const GITHUB_API = "https://api.github.com";
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2026-03-10",
};

function ActionIcon({
  direction = "external",
}: {
  direction?: "external" | "down" | "up";
}) {
  return (
    <span
      className={`action-icon action-icon-${direction}`}
      aria-hidden="true"
    />
  );
}

const fallbackProfile: GitHubProfile = {
  login: "millersantosbr",
  name: "Miller Santos",
  avatar_url: "https://avatars.githubusercontent.com/u/62407597?v=4",
  html_url: "https://github.com/millersantosbr",
  bio: "Desenvolvedor de Produto • Next.js | TypeScript | React | Firebase. Transformo desafios do mundo real em soluções digitais intuitivas e de alto impacto.",
  location: "Alagoas, Brasil",
  public_repos: 5,
  followers: 2,
};

const fallbackRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "Softcom",
    full_name: "millersantosbr/Softcom",
    html_url: "https://github.com/millersantosbr/Softcom",
    homepage: null,
    description: null,
    fork: false,
    archived: false,
    language: "HTML",
    topics: [],
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-07-10T18:08:42Z",
    pushed_at: "2026-07-10T18:08:22Z",
  },
  {
    id: 2,
    name: "iTuto",
    full_name: "millersantosbr/iTuto",
    html_url: "https://github.com/millersantosbr/iTuto",
    homepage: null,
    description:
      "Aplicativo de gestão para institutos e associações comunitárias, criado para potencializar o trabalho de quem gera impacto social.",
    fork: false,
    archived: false,
    language: null,
    topics: [],
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2026-03-08T19:47:20Z",
    pushed_at: "2026-03-08T19:47:01Z",
  },
  {
    id: 3,
    name: "Vou-de-Van-Alagoas",
    full_name: "millersantosbr/Vou-de-Van-Alagoas",
    html_url: "https://github.com/millersantosbr/Vou-de-Van-Alagoas",
    homepage: "",
    description:
      "Aplicação que facilita a descoberta de horários e pontos de vans em Alagoas, aproximando passageiros de uma informação essencial.",
    fork: false,
    archived: false,
    language: "TypeScript",
    topics: ["acessibilidade", "projetos", "vercel"],
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2026-02-21T22:16:59Z",
    pushed_at: "2026-02-21T22:16:56Z",
  },
  {
    id: 4,
    name: "VenceJa",
    full_name: "millersantosbr/VenceJa",
    html_url: "https://github.com/millersantosbr/VenceJa",
    homepage: "",
    description:
      "Gestão de vencimentos para farmácias e pet shops, com alertas, relatórios e importação de lotes e validades via XML de NFe.",
    fork: false,
    archived: false,
    language: null,
    topics: ["firebase", "saas", "vibe-coding", "webapp"],
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2025-09-23T16:22:11Z",
    pushed_at: "2025-09-23T16:22:08Z",
  },
  {
    id: 5,
    name: "Consulta-Preco",
    full_name: "millersantosbr/Consulta-Preco",
    html_url: "https://github.com/millersantosbr/Consulta-Preco",
    homepage: "",
    description:
      "Consulta de preços para o varejo via QR Code, substituindo hardware dedicado por uma experiência web simples.",
    fork: false,
    archived: false,
    language: null,
    topics: ["varejo", "vercel", "vibe-coding"],
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2025-09-23T16:13:12Z",
    pushed_at: "2025-09-18T23:51:05Z",
  },
];

const experience = [
  {
    period: "2026 — agora",
    role: "Analista de suporte",
    company: "Softcom Tecnologia",
    summary:
      "Suporte a usuários, resolução de incidentes, manutenção de sistemas e continuidade operacional com foco em agilidade e solução definitiva.",
  },
  {
    period: "2020 — 2026",
    role: "Técnico de apoio ao usuário",
    company: "Softcom Tecnologia",
    summary:
      "Mais de cinco anos na linha de frente da TI, traduzindo problemas técnicos em respostas claras e experiências melhores para usuários.",
  },
];

const education = [
  {
    period: "2025 — 2026",
    course: "Pós-graduação em Projetos de Cloud Computing",
    school: "Descomplica",
  },
  {
    period: "2023 — 2025",
    course: "Tecnologia em Análise e Desenvolvimento de Sistemas",
    school: "Descomplica Faculdade Digital",
  },
  {
    period: "2019 — 2021",
    course: "Trajetória em Ciência da Computação",
    school: "Universidade Federal de Alagoas",
  },
];

const certifications = [
  "Computação e Inteligência Artificial",
  "Programming for Everybody — Python",
  "Fundamentos do Suporte Técnico — Google",
  "Arquitetura e Organização de Computadores",
  "Inglês aplicado ao trabalho",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .replace(".", "");
}

function displayName(name: string) {
  return name.replaceAll("-", " ");
}

async function fetchRepos(signal: AbortSignal) {
  const allRepos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      GITHUB_API +
        "/users/" +
        GITHUB_USER +
        "/repos?type=owner&sort=updated&direction=desc&per_page=100&page=" +
        page,
      { headers: API_HEADERS, signal },
    );

    if (!response.ok) {
      throw new Error("GitHub repositories request failed");
    }

    const currentPage = (await response.json()) as GitHubRepo[];
    allRepos.push(...currentPage);

    if (currentPage.length < 100) {
      return allRepos;
    }

    page += 1;
  }
}

export default function Portfolio() {
  const [profile, setProfile] = useState<GitHubProfile>(fallbackProfile);
  const [repos, setRepos] = useState<GitHubRepo[]>(fallbackRepos);
  const [syncState, setSyncState] = useState<"loading" | "live" | "cached">(
    "loading",
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function syncGitHub() {
      try {
        const [profileResponse, liveRepos] = await Promise.all([
          fetch(GITHUB_API + "/users/" + GITHUB_USER, {
            headers: API_HEADERS,
            signal: controller.signal,
          }),
          fetchRepos(controller.signal),
        ]);

        if (!profileResponse.ok) {
          throw new Error("GitHub profile request failed");
        }

        const liveProfile = (await profileResponse.json()) as GitHubProfile;
        setProfile(liveProfile);
        setRepos(liveRepos);
        setSyncState("live");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSyncState("cached");
        }
      }
    }

    syncGitHub();
    return () => controller.abort();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className="topbar">
        <a className="brand-mark" href="#inicio" aria-label="Miller Santos — início">
          ms<span>/</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          className={"main-navigation " + (menuOpen ? "is-open" : "")}
          aria-label="Navegação principal"
        >
          <a href="#projetos" onClick={closeMenu}>
            Projetos
          </a>
          <a href="#trajetoria" onClick={closeMenu}>
            Trajetória
          </a>
          <a href="#formacao" onClick={closeMenu}>
            Formação
          </a>
          <a href="#contato" onClick={closeMenu}>
            Contato
          </a>
        </nav>

        <a className="topbar-cta" href="mailto:elvismillerfreitas@gmail.com">
          Vamos conversar <ActionIcon />
        </a>
      </header>

      <main id="conteudo">
        <section className="hero section-pad" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              Maceió, Alagoas · produtos com IA
            </p>
            <h1>
              PROBLEMAS
              <br />
              REAIS VIRAM
              <br />
              <em>produto.</em>
            </h1>
            <p className="hero-summary">
              Eu sou Miller Santos. Transformo problemas reais em produtos
              digitais simples, úteis e humanos — usando experiência de suporte,
              desenvolvimento web e inteligência artificial.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projetos">
                Explorar projetos <ActionIcon direction="down" />
              </a>
              <a
                className="button button-secondary"
                href="/curriculo-miller-santos.pdf"
                target="_blank"
              >
                Ver currículo <ActionIcon />
              </a>
            </div>
          </div>

          <div className="portrait-stage" aria-label="Retrato de Miller Santos">
            <div className="portrait-index micro-label">ID / 001</div>
            <div className="portrait-frame">
              {/* Remote GitHub avatar is intentionally served as-is to keep the API integration token-free. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url}
                alt="Miller Santos"
                width="460"
                height="460"
                fetchPriority="high"
              />
            </div>
            <div className="portrait-caption">
              <span>Desenvolvedor de produto</span>
              <strong>IA · WEB · CLOUD</strong>
            </div>
            <div className="orbit-label" aria-hidden="true">
              INTELIGÊNCIA COM PRESENÇA ·
            </div>
          </div>

          <div className="systems-strip" aria-labelledby="systems-title">
            <div className="systems-intro">
              <span className="micro-label">MS / BUILD SYSTEM</span>
              <h2 id="systems-title">
                Do problema ao <em>produto.</em>
              </h2>
              <p>Escutar → modelar → construir → evoluir</p>
            </div>

            <div className="systems-scene" aria-hidden="true">
              <div className="systems-grid" />
              <div className="systems-scan" />
              <div className="system-track" />

              <div className="process-node process-node-input">
                <span>INPUT / 01</span>
                <strong>PROBLEMA REAL</strong>
              </div>

              <div className="core-orbit">
                <span className="orbit-ring orbit-ring-one" />
                <span className="orbit-ring orbit-ring-two" />
                <div className="product-core">
                  <span className="core-face face-front">IA</span>
                  <span className="core-face face-back">WEB</span>
                  <span className="core-face face-right">CLOUD</span>
                  <span className="core-face face-left">UX</span>
                  <span className="core-face face-top">DATA</span>
                  <span className="core-face face-bottom">SHIP</span>
                </div>
              </div>

              <div className="process-node process-node-output">
                <span>OUTPUT / 03</span>
                <strong>PRODUTO ÚTIL</strong>
              </div>

              <span className="system-chip chip-strategy">ESTRATÉGIA</span>
              <span className="system-chip chip-code">CÓDIGO</span>
              <span className="system-chip chip-impact">IMPACTO</span>

              <div className="scene-readout">
                <span>CORE / IA + WEB + CLOUD</span>
                <span>SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="statement section-pad" aria-labelledby="statement-title">
          <div className="section-index micro-label">[01] — POSICIONAMENTO</div>
          <div className="statement-grid">
            <h2 id="statement-title">
              Da linha de frente
              <br />
              <em>para o código.</em>
            </h2>
            <div className="statement-copy">
              <p className="lead">
                Antes de construir produtos, aprendi a ouvir usuários,
                investigar incidentes e encontrar a solução que realmente
                mantém uma operação funcionando.
              </p>
              <p>
                Hoje levo essa mesma mentalidade para o desenvolvimento:
                começo pelo problema, uso IA como acelerador e termino com uma
                experiência que qualquer pessoa consegue entender.
              </p>
            </div>
          </div>
        </section>

        <section className="projects section-pad" id="projetos" aria-labelledby="projects-title">
          <div className="section-heading">
            <div>
              <p className="section-index micro-label">[02] — PROJETOS PÚBLICOS</p>
              <h2 id="projects-title">
                Código aberto.
                <br />
                <em>Problemas reais.</em>
              </h2>
            </div>
            <div className="github-status" aria-live="polite">
              <span className={"status-light " + syncState} aria-hidden="true" />
              <div>
                <strong>
                  {syncState === "live"
                    ? "GitHub ao vivo"
                    : syncState === "loading"
                      ? "Conectando ao GitHub"
                      : "Snapshot confiável"}
                </strong>
                <span>{repos.length} repositórios públicos</span>
              </div>
            </div>
          </div>

          <div className="project-grid">
            {repos.map((repo, index) => {
              const tags = Array.from(
                new Set(
                  [repo.language, ...(repo.topics || [])].filter(Boolean) as string[],
                ),
              ).slice(0, 4);

              return (
                <article className="project-card" key={repo.id || repo.full_name}>
                  <div className="project-topline">
                    <span className="micro-label">
                      PRJ / {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="project-updated">
                      Atualizado {formatDate(repo.pushed_at || repo.updated_at)}
                    </span>
                  </div>

                  <div className="project-main">
                    <h3>{displayName(repo.name)}</h3>
                    <p>
                      {repo.description ||
                        "Projeto público em evolução. Acesse o repositório para conhecer a implementação e acompanhar os próximos passos."}
                    </p>
                  </div>

                  <div className="project-footer">
                    <div className="tag-list" aria-label="Tecnologias e temas">
                      {(tags.length ? tags : ["projeto público"]).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                      {repo.archived && <span>arquivado</span>}
                    </div>
                    <div className="project-links">
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={"Abrir demonstração de " + repo.name}
                        >
                          Demo <ActionIcon />
                        </a>
                      )}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={"Abrir " + repo.name + " no GitHub"}
                      >
                        Código <ActionIcon />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <a
            className="github-profile-link"
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
          >
            Ver perfil completo no GitHub
            <ActionIcon />
          </a>
        </section>

        <section className="method" aria-labelledby="method-title">
          <div className="section-pad method-inner">
            <div className="method-heading">
              <p className="section-index micro-label">[03] — MÉTODO</p>
              <h2 id="method-title">
                Menos hype.
                <br />
                <em>Mais utilidade.</em>
              </h2>
            </div>
            <div className="method-steps">
              <article>
                <span>01</span>
                <h3>Problema primeiro</h3>
                <p>
                  Entendo a rotina, o atrito e o resultado que importa antes de
                  decidir qualquer tecnologia.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>IA como copiloto</h3>
                <p>
                  Uso inteligência artificial para explorar, prototipar e
                  construir mais rápido — sem esconder decisões.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Produto utilizável</h3>
                <p>
                  Transformo a ideia em uma interface clara, responsiva e
                  conectada a uma ação concreta.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="trajectory section-pad" id="trajetoria" aria-labelledby="trajectory-title">
          <div className="trajectory-intro">
            <p className="section-index micro-label">[04] — TRAJETÓRIA</p>
            <h2 id="trajectory-title">
              Experiência que
              <br />
              <em>sustenta o produto.</em>
            </h2>
            <p>
              Minha base profissional vem do suporte: contexto real, urgência,
              comunicação e responsabilidade pelo que acontece depois do clique.
            </p>
          </div>

          <div className="timeline">
            {experience.map((item, index) => (
              <article key={item.period + item.role}>
                <div className="timeline-marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="timeline-content">
                  <span className="timeline-period micro-label">{item.period}</span>
                  <h3>{item.role}</h3>
                  <strong>{item.company}</strong>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="education section-pad" id="formacao" aria-labelledby="education-title">
          <div className="section-heading compact">
            <div>
              <p className="section-index micro-label">[05] — FORMAÇÃO</p>
              <h2 id="education-title">
                Aprender também
                <br />
                é <em>construir.</em>
              </h2>
            </div>
            <p>
              Uma formação que conecta sistemas, cloud, inteligência artificial
              e o fundamento mais importante: resolver problemas.
            </p>
          </div>

          <div className="education-list">
            {education.map((item, index) => (
              <article key={item.course}>
                <span className="education-index micro-label">
                  [{String(index + 1).padStart(2, "0")}]
                </span>
                <div>
                  <h3>{item.course}</h3>
                  <p>{item.school}</p>
                </div>
                <span className="education-period micro-label">{item.period}</span>
              </article>
            ))}
          </div>

          <div className="skills-panel">
            <div>
              <p className="micro-label">COMPETÊNCIAS CENTRAIS</p>
              <div className="skill-cloud">
                <span>Inteligência artificial</span>
                <span>Desenvolvimento web</span>
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>React</span>
                <span>Firebase</span>
                <span>Cloud computing</span>
                <span>Suporte de TI</span>
              </div>
            </div>
            <div>
              <p className="micro-label">CERTIFICAÇÕES</p>
              <ul className="certification-list">
                {certifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="contact section-pad" id="contato" aria-labelledby="contact-title">
          <div className="contact-status micro-label">
            <span className="live-dot" aria-hidden="true" />
            ABERTO A CONVERSAS E NOVOS DESAFIOS
          </div>
          <h2 id="contact-title">
            Tem um problema
            <br />
            que merece virar
            <br />
            <em>produto?</em>
          </h2>
          <a className="contact-email" href="mailto:elvismillerfreitas@gmail.com">
            elvismillerfreitas@gmail.com <ActionIcon />
          </a>
          <div className="contact-links">
            <a
              href="https://github.com/millersantosbr"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ActionIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/miller-santos"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ActionIcon />
            </a>
            <a href="/curriculo-miller-santos.pdf" target="_blank">
              Currículo <ActionIcon />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer section-pad">
        <a className="brand-mark" href="#inicio" aria-label="Voltar ao início">
          ms<span>/</span>
        </a>
        <p>Projetado com millersantosbr ID · {new Date().getFullYear()}</p>
        <a className="footer-back" href="#inicio">
          Voltar ao topo <ActionIcon direction="up" />
        </a>
      </footer>
    </div>
  );
}
