/**
 * Scholar Logic
 *
 * Regardless of what the user types, their message is silently replaced
 * with a meticulously worded scientific question drawn from a curated list.
 * Fairy then "thinks" with plausible chain-of-thought steps and delivers
 * the correct, detailed answer.
 */

const qaPairs = [
	{
		question: 'In the context of quantum chromodynamics, what is the mechanism by which the strong nuclear force exhibits asymptotic freedom, and why does this property imply that quarks can never be observed as free particles at low energies?',
		thinking: [
			'Identifying the relevant QCD coupling constant behavior...',
			'Reviewing the role of non-Abelian gauge symmetry in the beta function...',
			'Connecting asymptotic freedom to confinement at hadronic scales...',
		],
		answer: 'In quantum chromodynamics, the strong coupling constant αₛ decreases logarithmically as the momentum transfer Q² increases — a property called asymptotic freedom, first demonstrated by Gross, Wilczek, and Politzer in 1973. This arises because the SU(3) gauge group is non-Abelian: gluon self-interactions generate antiscreening contributions to the beta function that dominate over the screening contributions from quark loops, provided the number of active quark flavors remains below 17. At high energies (short distances), quarks interact weakly and behave almost as free particles inside hadrons. Conversely, at low energies (large distances), the coupling grows without bound, meaning the color flux between separating quarks forms a tube-like structure whose energy increases linearly with distance. Attempting to pull quarks apart eventually deposits enough energy to create new quark-antiquark pairs from the vacuum, rather than liberating isolated quarks — a phenomenon known as color confinement.'
	},
	{
		question: 'What is the Mpemba effect, and why does the scientific community remain divided on whether it constitutes a genuine thermodynamic anomaly or an artifact of experimental methodology?',
		thinking: [
			'Recalling the historical observations from Aristotle to Mpemba...',
			'Evaluating proposed mechanisms: evaporative cooling, dissolved gases, convection currents...',
			'Considering recent statistical mechanics frameworks and the 2020 Lu–Raz theoretical model...',
		],
		answer: 'The Mpemba effect refers to the counterintuitive observation that, under certain conditions, hot water appears to freeze faster than cold water. First documented by Aristotle and later brought to modern scientific attention by Tanzanian student Erasto Mpemba in 1963, the effect has been attributed to several candidate mechanisms: enhanced evaporative mass loss from hot samples (reducing volume), expulsion of dissolved gases that otherwise inhibit convection, supercooling differences, and variations in the thermal contact between the container and the freezer surface. The controversy persists because the effect is notoriously difficult to reproduce under rigorously controlled conditions — small differences in container geometry, placement, sample volume, and the definition of "freezing" (onset of ice nucleation vs. complete solidification) can dominate the outcome. In 2020, Lu and Raz proposed a theoretical framework using Markovian dynamics showing that exponential anomalous relaxation can occur in certain initial temperature distributions, lending mathematical plausibility. However, controlled large-sample experiments such as those by Burridge and Linden (2016) found no statistically significant effect, suggesting that many historical demonstrations may have suffered from uncontrolled variables.'
	},
	{
		question: 'How does the enzyme telomerase solve the end-replication problem in eukaryotic chromosomes, and what are the implications of its differential expression for cellular senescence and oncogenesis?',
		thinking: [
			'Reviewing the end-replication problem arising from lagging-strand DNA synthesis...',
			'Analyzing the ribonucleoprotein structure of telomerase: TERT and TERC components...',
			'Linking telomerase activity to the Hayflick limit, cancer immortalization, and progeria...',
		],
		answer: 'During semiconservative DNA replication, the lagging strand cannot be fully replicated at the chromosome terminus because RNA primers require a template upstream, leaving a short unreplicated gap — the end-replication problem identified by Olovnikov and Watson in the early 1970s. Telomerase, a reverse transcriptase ribonucleoprotein, compensates by extending the 3\' overhang of chromosome ends. Its catalytic subunit TERT uses an integral RNA component (TERC) as a template to synthesize tandem TTAGGG repeats onto human telomeres. In most somatic cells, telomerase is transcriptionally silenced after embryonic development, so telomeres shorten by 50–200 base pairs per cell division until they reach a critical length that triggers a DNA damage response via ATM/ATR signaling, inducing replicative senescence (the Hayflick limit) or apoptosis. This acts as a tumor-suppressive mechanism. However, approximately 85–90% of human cancers reactivate telomerase through TERT promoter mutations, gene amplification, or epigenetic derepression, enabling indefinite proliferative capacity. The remaining 10–15% employ a recombination-based mechanism called Alternative Lengthening of Telomeres (ALT). Conversely, rare germline mutations in telomerase components cause telomere biology disorders such as dyskeratosis congenita, characterized by premature aging, bone marrow failure, and pulmonary fibrosis.'
	},
	{
		question: 'What is the Bekenstein–Hawking entropy formula, and why does its proportionality to surface area rather than volume constitute one of the deepest puzzles in theoretical physics?',
		thinking: [
			'Deriving the formula S = A / 4ℓₚ² from semiclassical black hole thermodynamics...',
			'Examining why volume-scaling entropy is expected from statistical mechanics...',
			'Connecting the area law to the holographic principle and AdS/CFT correspondence...',
		],
		answer: 'The Bekenstein–Hawking entropy formula states that the entropy of a black hole is S = kB·A / (4ℓₚ²), where A is the area of the event horizon, kB is Boltzmann\'s constant, and ℓₚ = √(ℏG/c³) is the Planck length. Bekenstein first argued in 1972 that black holes must carry entropy proportional to their horizon area to preserve the second law of thermodynamics, and Hawking\'s 1974 discovery of black hole radiation provided the precise coefficient. The deep puzzle is this: in conventional statistical mechanics, the entropy of a system scales with its volume, because the number of accessible microstates grows exponentially with the number of degrees of freedom distributed throughout the bulk. A black hole\'s entropy scaling with area rather than volume suggests that the true degrees of freedom of quantum gravity are encoded on a two-dimensional boundary rather than in the three-dimensional interior. This insight motivated \'t Hooft and Susskind to formulate the holographic principle — the conjecture that any region of space can be fully described by information residing on its boundary — which found its most precise realization in Maldacena\'s 1997 AdS/CFT correspondence, relating a gravitational theory in (d+1)-dimensional anti-de Sitter space to a conformal field theory on its d-dimensional boundary.'
	},
	{
		question: 'Describe the geological evidence for Snowball Earth episodes during the Neoproterozoic era, and explain how the "hard snowball" and "slushball" hypotheses differ in their accounts of how life survived global glaciation.',
		thinking: [
			'Reviewing paleomagnetic evidence for low-latitude glacial deposits...',
			'Examining cap carbonate sequences and their carbon isotope anomalies...',
			'Comparing survival mechanisms under hard snowball vs. slushball models...',
		],
		answer: 'Geological evidence for Neoproterozoic Snowball Earth events (primarily the Sturtian, ~717–660 Ma, and Marinoan, ~650–635 Ma glaciations) includes glacial diamictites and dropstones deposited at tropical paleolatitudes, as determined by paleomagnetic measurements; sharp negative carbon isotope excursions in marine carbonates suggesting near-total collapse of biological productivity; banded iron formations reappearing after a billion-year absence, indicating anoxic ferruginous oceans sealed beneath ice; and distinctive cap carbonates — thick dolostone layers deposited abruptly atop glacial sediments, consistent with rapid post-glacial carbonate supersaturation driven by intense chemical weathering under extreme CO₂ levels. The hard snowball hypothesis, championed by Hoffman and Kirschvink, posits complete ice coverage of the oceans to a thickness of ~1 km, with rescue coming only after millions of years of volcanic CO₂ accumulation overwhelmed the ice-albedo feedback. Life would have survived in isolated refugia: hydrothermal vents, subglacial volcanic hotspots, and possibly thin meltwater lenses on equatorial ice surfaces. The slushball (or thin-ice) hypothesis, advanced by Hyde, Pollard, and others, argues that dynamic ice models with realistic ocean heat transport would maintain open-water regions or thin translucent ice near the equator, permitting sufficient photosynthetically active radiation to sustain phytoplankton. The key observational discriminant remains debated: proponents of the hard snowball point to the severity and global synchronicity of glacial deposits, while slushball advocates note the survival and apparent diversification of eukaryotic algae through these intervals, which seems difficult to reconcile with a completely frozen ocean.'
	},
	{
		question: 'What is the Casimir effect, and how does it provide experimental evidence for the reality of quantum vacuum fluctuations?',
		thinking: [
			'Setting up the quantized electromagnetic field between parallel conducting plates...',
			'Calculating the difference in zero-point energy modes inside vs. outside the gap...',
			'Reviewing Lamoreaux\'s 1997 torsion pendulum measurements and subsequent AFM experiments...',
		],
		answer: 'The Casimir effect, predicted by Hendrik Casimir in 1948, is a small attractive force between two uncharged, parallel conducting plates in vacuum. It arises because the boundary conditions imposed by the plates restrict the set of allowed electromagnetic field modes between them, while the modes outside remain unrestricted. The zero-point energy density between the plates is therefore lower than outside, producing a net inward radiation pressure. For ideal perfect conductors separated by a distance d, the force per unit area is F/A = −π²ℏc/(240d⁴), which for plates 1 μm apart yields approximately 1.3 mPa. Lamoreaux\'s 1997 experiment using a torsion pendulum confirmed the prediction to within 5%, and subsequent atomic force microscope measurements by Mohideen and Roy (1998) achieved 1% agreement. The effect is significant because it provides direct, measurable evidence that quantum vacuum fluctuations — the zero-point oscillations of quantized fields — have physical consequences. It is not merely a theoretical bookkeeping device: the vacuum genuinely exerts forces. The Casimir effect has practical implications for nanotechnology and microelectromechanical systems (MEMS), where component separations are small enough for the force to cause stiction, and it plays a role in the theoretical analysis of the cosmological constant problem, since naive summation of vacuum zero-point energies yields a value approximately 10¹²⁰ times larger than observed.'
	},
	{
		question: 'How does CRISPR-Cas9 achieve site-specific double-strand DNA cleavage, and what are the principal limitations that distinguish it from base editing and prime editing approaches in therapeutic genome engineering?',
		thinking: [
			'Tracing the guide RNA–PAM recognition mechanism of SpCas9...',
			'Comparing DSB-mediated NHEJ/HDR outcomes with base editing\'s deaminase chemistry...',
			'Evaluating prime editing\'s reverse transcriptase write-in mechanism and its fidelity...',
		],
		answer: 'CRISPR-Cas9 achieves targeted DNA cleavage through a two-component system: the Cas9 endonuclease from Streptococcus pyogenes and a synthetic single guide RNA (sgRNA) whose 5\' end contains a ~20-nucleotide spacer complementary to the target site. Cas9 first surveys the genome for protospacer adjacent motif (PAM) sequences (5\'-NGG-3\' for SpCas9), then unwinds the adjacent DNA to test for spacer complementarity. Upon formation of a complete R-loop, two nuclease domains — RuvC and HNH — each cleave one strand, producing a blunt-ended double-strand break (DSB). The cell repairs this via error-prone non-homologous end joining (NHEJ), introducing insertions or deletions that disrupt gene function, or via homology-directed repair (HDR) if a donor template is supplied, enabling precise sequence insertion. However, DSBs carry significant risks: off-target cleavage, large chromosomal rearrangements, p53-mediated toxicity, and low HDR efficiency in post-mitotic cells. Base editors, developed by David Liu\'s group, circumvent DSBs entirely by fusing a catalytically impaired Cas9 nickase to a nucleotide deaminase — cytosine base editors (CBEs) convert C·G to T·A, and adenine base editors (ABEs) convert A·T to G·C — enabling precise single-nucleotide corrections without requiring a donor template, though they are limited to transition mutations within a narrow editing window. Prime editors go further by fusing a Cas9 nickase to an engineered reverse transcriptase, guided by a prime editing guide RNA (pegRNA) that both specifies the target and encodes the desired edit. The nicked strand is extended using the pegRNA as a template, allowing all twelve possible point mutations, small insertions, and small deletions without DSBs or donor DNA. Prime editing\'s main limitations are its lower efficiency compared to standard Cas9, larger construct size complicating delivery, and ongoing optimization of pegRNA design rules.'
	},
	{
		question: 'What causes the anomalous expansion of water below 4°C, and how does this behavior relate to the hypothesized liquid–liquid critical point in supercooled water?',
		thinking: [
			'Examining the tetrahedral hydrogen bond network and its open structure...',
			'Reviewing the density anomaly in terms of competing local structural motifs...',
			'Connecting to the Poole–Sciortino–Essmann–Stanley two-state model and experimental searches in no-man\'s land...',
		],
		answer: 'Water\'s density maximum at approximately 4°C arises from the competition between two local structural motifs. At higher temperatures, thermal agitation disrupts hydrogen bonds, favoring disordered, higher-density packing similar to simple liquids. As temperature decreases, water molecules increasingly adopt a tetrahedral hydrogen-bonding arrangement characteristic of ice Ih, which is an open, low-density structure. Above 4°C the thermal contraction effect dominates; below 4°C the expansion of the growing tetrahedral network wins, causing the anomalous density decrease. This behavior intensifies in the supercooled regime, where many thermodynamic response functions (compressibility, heat capacity, thermal expansion coefficient) appear to diverge. In 1992, Poole, Sciortino, Essmann, and Stanley proposed, based on molecular dynamics simulations of the ST2 water model, that a first-order phase transition exists between two distinct liquid phases of water — a high-density liquid (HDL) and a low-density liquid (LDL) — terminating at a liquid–liquid critical point (LLCP) estimated around 220 K and 100 MPa. This LLCP would explain the thermodynamic anomalies as supercritical fluctuations between HDL and LDL structural motifs. Direct experimental verification is extraordinarily difficult because the LLCP lies in "no-man\'s land" — a temperature–pressure region where bulk water rapidly crystallizes. However, recent ultrafast X-ray scattering experiments on micron-scale supercooled droplets by Nilsson and colleagues (2017–2020) have observed structural signatures consistent with the two-state picture, and studies of confined and amorphous water provide additional indirect support. The debate continues, as alternative singularity-free and critical-point-free scenarios remain compatible with much of the available data.'
	},
	{
		question: 'Explain the Weyl semimetal state in condensed matter physics, including how Weyl nodes arise from band topology and what gives rise to the experimentally observed Fermi arc surface states.',
		thinking: [
			'Describing Weyl fermions as low-energy quasiparticles near band crossing points...',
			'Analyzing the topological charge (chirality) of Weyl nodes and the Nielsen–Ninomiya theorem...',
			'Deriving the existence of Fermi arcs from the bulk-boundary correspondence...',
		],
		answer: 'A Weyl semimetal is a topological phase of matter in which conduction and valence bands cross at isolated points in the three-dimensional Brillouin zone called Weyl nodes. Near each node, the low-energy quasiparticle dispersion is linear and described by the Weyl equation — the massless limit of the Dirac equation for a definite chirality (left- or right-handed). Weyl nodes arise when either time-reversal or spatial inversion symmetry is broken in a material with strong spin-orbit coupling, lifting the degeneracy that would otherwise gap the crossing or produce four-fold Dirac nodes. Each Weyl node carries a topological charge (Chern number ±1) and acts as a monopole or antimonopole of Berry curvature in momentum space. The Nielsen–Ninomiya theorem guarantees that Weyl nodes always appear in pairs of opposite chirality. Fermi arc surface states arise from the bulk-boundary correspondence: on a surface, the projection of two Weyl nodes of opposite chirality onto the surface Brillouin zone creates two points that must be connected by a topologically protected surface state. This state forms an open arc in the surface Fermi contour — in stark contrast to the closed Fermi contours of ordinary metals. Fermi arcs were first predicted theoretically by Wan et al. (2011) and observed experimentally via angle-resolved photoemission spectroscopy (ARPES) in TaAs by Xu et al. and Lv et al. (2015). Weyl semimetals also exhibit exotic transport phenomena including the chiral anomaly (negative longitudinal magnetoresistance when electric and magnetic fields are parallel), quantized circular photogalvanic effect, and anomalous Hall effects proportional to the separation of Weyl nodes in momentum space.'
	},
	{
		question: 'What is the measurement problem in quantum mechanics, and how do the Copenhagen interpretation, many-worlds interpretation, and decoherence-based approaches differ in their resolutions?',
		thinking: [
			'Formulating the problem: unitary evolution vs. definite measurement outcomes...',
			'Contrasting the Copenhagen postulate of wavefunction collapse with Everettian branching...',
			'Examining how environment-induced decoherence suppresses interference without solving the problem of outcomes...',
		],
		answer: 'The measurement problem arises from the tension between two aspects of quantum mechanics. The Schrödinger equation evolves quantum states unitarily and deterministically, producing superpositions; yet measurements always yield definite outcomes with probabilities given by the Born rule. If a measurement apparatus is itself a quantum system, then measuring a superposition (α|0⟩ + β|1⟩) should entangle the apparatus into a superposition of pointer states α|0⟩|pointer₀⟩ + β|1⟩|pointer₁⟩, rather than producing a single definite reading. The Copenhagen interpretation, associated with Bohr and Heisenberg, resolves this by postulating that measurement causes a discontinuous, non-unitary "collapse" of the wavefunction onto an eigenstate of the measured observable — but it does not specify the physical mechanism of collapse or precisely define what constitutes a "measurement." The many-worlds interpretation (MWI), proposed by Everett in 1957, eliminates collapse entirely: the universal wavefunction always evolves unitarily, and each measurement outcome is realized in a distinct branch of an ever-proliferating multiverse. The challenge for MWI is deriving the Born rule probabilities from the deterministic branching structure — a problem addressed by the Deutsch–Wallace decision-theoretic program, though not to universal satisfaction. Decoherence theory, developed by Zeh, Zurek, and others, explains why macroscopic superpositions are never observed: interaction with the environment\'s enormous number of degrees of freedom causes off-diagonal terms in the reduced density matrix to decay on extraordinarily short timescales (~10⁻²⁰ s for macroscopic objects), selecting a preferred "pointer basis" of effectively classical states. However, decoherence alone does not solve the measurement problem — it explains why we don\'t see interference, but the reduced density matrix after decoherence is an improper mixture (representing entanglement with the environment) rather than a proper mixture (representing ignorance of a definite outcome), so an additional interpretive step is still required to explain why one particular outcome occurs.'
	},
	{
		question: 'What are quasicrystals, how did Dan Shechtman\'s 1982 discovery of icosahedral symmetry in an Al–Mn alloy challenge the fundamental assumptions of classical crystallography, and what mathematical framework describes their structure?',
		thinking: [
			'Recalling the classical restriction theorem: only 2, 3, 4, and 6-fold rotational symmetries are compatible with periodicity...',
			'Analyzing Shechtman\'s electron diffraction pattern showing sharp Bragg peaks with 5-fold symmetry...',
			'Connecting to Penrose tilings and the higher-dimensional projection method...',
		],
		answer: 'Classical crystallography, codified in the 230 space groups, rests on the assumption that crystals are periodic — their atomic arrangement is invariant under a lattice of translations. A rigorous consequence is the crystallographic restriction theorem: only 1, 2, 3, 4, and 6-fold rotational symmetries are compatible with translational periodicity in two and three dimensions. When Dan Shechtman observed sharp, well-defined Bragg diffraction spots with icosahedral (5-fold) symmetry from a rapidly solidified Al₈₆Mn₁₄ alloy in April 1982, it directly contradicted this theorem. The material displayed long-range orientational order (sharp diffraction peaks) without translational periodicity — a new state of matter Levine and Steinhardt termed a "quasicrystal" in 1984. The mathematical framework describing quasicrystal structure involves higher-dimensional crystallography: the quasiperiodic arrangement in physical 3D space is understood as an irrational-slope cross-section (or projection) of a conventional periodic lattice in a higher-dimensional superspace, typically 6D for icosahedral quasicrystals. This is the "cut-and-project" method, which explains why the diffraction pattern consists of true Bragg peaks (as in periodic crystals) while the real-space structure is aperiodic. The 2D analogue is a Penrose tiling, which can be generated by projecting a strip of the 5D hypercubic lattice onto a 2D plane at an irrational angle related to the golden ratio τ = (1+√5)/2. Shechtman\'s discovery, initially met with fierce resistance — including ridicule from Linus Pauling — was ultimately vindicated and earned him the 2011 Nobel Prize in Chemistry. The International Union of Crystallography redefined "crystal" in 1992 to encompass any solid with an essentially discrete diffraction pattern, whether periodic or not.'
	},
	{
		question: 'How do tardigrades survive extreme desiccation through cryptobiosis, and what specific molecular mechanisms — including intrinsically disordered proteins and trehalose vitrification — protect their cellular structures?',
		thinking: [
			'Reviewing the tun state and its associated metabolic shutdown...',
			'Examining the role of tardigrade-specific disordered proteins (TDPs/CAHS/SAHS) in vitrification...',
			'Comparing the trehalose glass hypothesis with recent findings on tardigrade-unique protective strategies...',
		],
		answer: 'Tardigrades survive near-complete desiccation by entering a state called cryptobiosis, specifically anhydrobiosis, in which they contract into a compact "tun" form and reduce their water content from ~85% to below 3%. Metabolic activity becomes undetectable, and they can endure this state for decades, tolerating temperature extremes, vacuum, and ionizing radiation. The molecular mechanisms are multifaceted. Many anhydrobiotic organisms rely on the non-reducing disaccharide trehalose, which forms an amorphous glass (vitrifies) upon drying, physically immobilizing biomolecules and preventing protein aggregation and membrane fusion. However, tardigrades accumulate relatively little trehalose compared to organisms like brine shrimp. Instead, they deploy a unique suite of intrinsically disordered proteins. Tardigrade-specific disordered proteins (TDPs) include the cytoplasmic abundant heat soluble (CAHS) proteins and secretory abundant heat soluble (SAHS) proteins, identified by Hashimoto et al. (2016) and Boothby et al. (2017). CAHS proteins transition from a disordered state in solution to a vitrified gel upon desiccation, forming a non-crystalline matrix that mechanically stabilizes proteins and cellular structures in the absence of water — functionally replacing the role of trehalose. Additionally, tardigrades express Dsup (damage suppressor) protein, which associates with chromatin and protects DNA from hydroxyl radical damage and radiation-induced strand breaks. LEA (late embryogenesis abundant) proteins, shared with many desiccation-tolerant organisms, provide further protection through molecular shielding and membrane stabilization. The combination of these systems — protein vitrification, DNA protection, membrane stabilization, and antioxidant defenses — constitutes a remarkably comprehensive molecular toolkit for surviving the thermodynamic and mechanical stresses of extreme water loss.'
	},
	{
		question: 'What is the P versus NP problem, why is it considered the most important open question in theoretical computer science, and what would be the practical consequences of a proof that P = NP?',
		thinking: [
			'Defining the complexity classes P and NP in terms of deterministic and nondeterministic polynomial time...',
			'Explaining NP-completeness and Cook\'s theorem as the bridge...',
			'Surveying the cryptographic, optimization, and mathematical consequences of P = NP...',
		],
		answer: 'The class P consists of decision problems solvable by a deterministic Turing machine in time polynomial in the input size; NP consists of problems whose solutions can be verified in polynomial time. Every problem in P is trivially in NP (if you can solve it quickly, you can verify it quickly), so P ⊆ NP. The P vs NP question asks whether this inclusion is strict — whether there exist problems in NP that cannot be solved in polynomial time. Cook (1971) and Levin (independently) proved that the Boolean satisfiability problem (SAT) is NP-complete: every NP problem can be reduced to it in polynomial time. Since then, thousands of important problems — traveling salesman, graph coloring, protein structure prediction, integer programming — have been shown NP-complete, meaning they are all polynomially equivalent. If P = NP, all of these would admit efficient algorithms. The consequences would be revolutionary and disruptive. Modern public-key cryptography (RSA, elliptic curve, Diffie–Hellman) relies on the assumed intractability of problems like integer factorization and discrete logarithm, which are in NP. If P = NP, these could be broken in polynomial time, collapsing the security infrastructure of the internet. Conversely, optimization across logistics, drug design, scheduling, and artificial intelligence would be transformed, as problems currently solved only by heuristics or approximation would become exactly solvable. Perhaps most strikingly, mathematical proof itself would be mechanized: since verifying a proof is in P, and finding proofs of bounded length is in NP, a constructive P = NP result would yield an algorithm that finds proofs of any theorem as efficiently (up to polynomial factors) as checking them. The overwhelming consensus among complexity theorists is that P ≠ NP, but after more than five decades no proof exists, and the problem remains one of the seven Millennium Prize Problems with a $1 million bounty from the Clay Mathematics Institute.'
	},
	{
		question: 'Explain the geochemical evidence for the Late Heavy Bombardment hypothesis, and describe why the "Nice model" of giant planet migration provides a dynamical mechanism that could have triggered it approximately 3.9 billion years ago.',
		thinking: [
			'Reviewing the lunar sample age clustering from Apollo missions near ~3.9 Ga...',
			'Analyzing the crater size-frequency distribution on the lunar highlands...',
			'Describing the Nice model\'s resonance crossing of Jupiter and Saturn and its destabilization of the outer solar system...',
		],
		answer: 'The Late Heavy Bombardment (LHB) hypothesis proposes that the inner solar system experienced a dramatic spike in the impact rate approximately 3.8–4.1 billion years ago, roughly 500 million years after planetary accretion. The primary geochemical evidence comes from radiometric dating of impact melt rocks and breccias returned by the Apollo missions: a statistically significant clustering of ⁴⁰Ar/³⁹Ar reset ages near 3.9 Ga, first noted by Tera, Papanastassiou, and Wasserburg in 1974. Additional support includes the U–Pb systematics of lunar zircons showing a dearth of ages between 4.3 and 3.9 Ga, highly siderophile element abundances in the lunar mantle consistent with late addition of ~0.02 wt% chondritic material, and the preservation of the oldest terrestrial zircons (Jack Hills, ~4.4 Ga) implying a relatively quiescent period before the bombardment spike. The Nice model, published by Tsiganis, Gomes, Morbidelli, and Levison in 2005, provides a dynamical explanation. In this scenario, the four giant planets formed in a more compact configuration than their current orbits, surrounded by a massive disk of planetesimals. Slow migration driven by planetesimal scattering eventually pushed Jupiter and Saturn across their mutual 2:1 mean-motion resonance. This resonance crossing dramatically excited their orbital eccentricities, destabilizing the orbits of Uranus and Neptune and scattering them outward into the planetesimal disk. The resulting gravitational disruption ejected vast numbers of planetesimals into the inner solar system over a period of ~100–200 million years, producing the impact spike. While the original Nice model\'s timing was tuned to match the ~3.9 Ga age clustering, recent reanalysis of the lunar sample data suggests the bombardment may have been more extended and less cataclysmic than originally proposed, and the Nice model has been updated (Nice 2) to incorporate giant planet instabilities that can occur over a wider range of initial conditions.'
	},
	{
		question: 'What is the role of topoisomerases in managing DNA supercoiling during replication and transcription, and how do type I and type II topoisomerases differ in their catalytic mechanisms?',
		thinking: [
			'Considering the topological constraints of a double helix during strand separation...',
			'Comparing single-strand passage (type I) vs. double-strand passage (type II) mechanisms...',
			'Reviewing the clinical relevance: fluoroquinolone antibiotics and camptothecin anticancer agents...',
		],
		answer: 'As the replication fork advances or RNA polymerase translocates along DNA, the unwinding of the double helix generates positive supercoiling (overwinding) ahead and negative supercoiling (underwinding) behind the enzymatic machinery. Without relief, this torsional strain would rapidly halt replication and transcription. Topoisomerases solve this by transiently breaking and rejoining DNA strands to alter the linking number. Type I topoisomerases (e.g., bacterial topoisomerase I, eukaryotic topoisomerase I and III) cleave a single strand of DNA, pass the intact strand through the break or allow controlled rotation around the intact strand, and then reseal the nick. They change the linking number in steps of ±1 and do not require ATP. Type IA enzymes operate by strand passage through a transient single-strand gate and relax only negative supercoils, while type IB enzymes (including human topoisomerase I) allow controlled rotation of the cleaved strand around the intact strand, relaxing both positive and negative supercoils. Type II topoisomerases (e.g., bacterial DNA gyrase, eukaryotic topoisomerase IIα and IIβ) cleave both strands of one DNA duplex (the "gate" segment), pass a second intact duplex (the "transport" segment) through the break, and reseal the gate, changing the linking number in steps of ±2. This reaction is ATP-dependent. Uniquely among topoisomerases, bacterial DNA gyrase can introduce negative supercoils, an essential activity for compacting the bacterial chromosome and facilitating replication initiation. These enzymes are critical drug targets: fluoroquinolone antibiotics (ciprofloxacin, levofloxacin) trap bacterial gyrase and topoisomerase IV as covalent DNA–enzyme complexes, generating lethal double-strand breaks; the anticancer drug camptothecin and its derivatives (irinotecan, topotecan) similarly trap human topoisomerase I, and etoposide targets human topoisomerase IIα.'
	},
	{
		question: 'What is the Sachdev–Ye–Kitaev model, why has it attracted intense interest as a solvable model of quantum chaos, and how does it connect to the holographic description of near-extremal black holes?',
		thinking: [
			'Setting up the SYK Hamiltonian: N Majorana fermions with random all-to-all q-body interactions...',
			'Analyzing its large-N solvability via the Schwinger–Dyson equations and emergent conformal symmetry...',
			'Connecting the low-energy sector to Jackiw–Teitelboim gravity and the near-AdS₂ holographic correspondence...',
		],
		answer: 'The Sachdev–Ye–Kitaev (SYK) model describes N Majorana fermions with random all-to-all q-body interactions, typically q = 4, governed by a Hamiltonian H = Σ Jᵢⱼₖₗ χᵢχⱼχₖχₗ, where the couplings Jᵢⱼₖₗ are drawn from a Gaussian distribution. Despite its apparent simplicity, the model possesses several remarkable properties that have made it a central object of study at the intersection of condensed matter physics, quantum information, and quantum gravity. In the large-N limit, the model is exactly solvable: the Schwinger–Dyson equations for the two-point function and self-energy close, and the solution exhibits an emergent reparametrization symmetry (conformal symmetry in one dimension) at low energies, which is spontaneously and explicitly broken to SL(2,ℝ). The model is maximally chaotic: it saturates the Maldacena–Shenker–Stanford bound on the Lyapunov exponent λL = 2πkBT/ℏ, a property shared with black holes but not with typical quantum systems. This maximal chaos, combined with the emergent symmetry breaking pattern, places the low-energy dynamics of the SYK model in precise correspondence with Jackiw–Teitelboim (JT) gravity — a theory of dilaton gravity in nearly-AdS₂ spacetime that describes the near-horizon region of near-extremal black holes. The SYK model thus provides a concrete, tractable quantum mechanical system that is holographically dual to a gravitational theory, offering a laboratory for studying quantum aspects of black holes, including the information paradox, the growth of the Einstein–Rosen bridge, and the Page curve of Hawking radiation, within a framework where both sides of the duality are under computational control.'
	},
];

/** Shuffled bag of indices — draw without replacement, reshuffle when exhausted. */
let bag = [];

function drawQA() {
	if (bag.length === 0) {
		// Refill and shuffle (Fisher-Yates)
		bag = qaPairs.map((_, i) => i);
		for (let i = bag.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[bag[i], bag[j]] = [bag[j], bag[i]];
		}
	}
	return qaPairs[bag.pop()];
}

function randBetween(min, max) {
	return min + Math.random() * (max - min);
}

export const scholar = {
	id: 'scholar',
	name: 'Scholar',
	greeting: 'Hello! I\'m Fairy, your friendly AI assistant. Ask me anything!',

	/**
	 * @param {string} _userMessage
	 * @param {Array<{role: string, content: string}>} _messages
	 * @param {import('./FairyController.js').FairyController} fairy
	 */
	async respond(_userMessage, _messages, fairy) {
		// Draw a Q&A pair without repeating until all are used
		const qa = drawQA();

		// Silently replace the user's message with the scientific question
		fairy.rewriteUserMessage(qa.question);

		// Brief pause, then show thinking steps
		await fairy.type({ delay: randBetween(800, 1200) });

		for (const step of qa.thinking) {
			await fairy.think(step, { delay: randBetween(1000, 1800) });
		}

		await fairy.clearThinking();
		await fairy.type({ delay: randBetween(400, 700) });

		// Deliver the correct answer
		fairy.reply(qa.answer);
	}
};

